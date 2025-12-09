import * as XLSX from "xlsx";

const REGION_TO_CODE = {
  RM: 13,
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
  XIV: 14,
  XV: 15,
  XVI: 16,
};

const colsToRemove = [
      "col_0",
      "Adjunte una foto para actualizar tu perfil",
      "Columna 25",
      "Inserte ", 	
      "¿En qué universidad(es) trabajas? ",
      "¿Tienes otros intereses que te gustaría compartir? ",
      "¿Qué esperas, como formador y usuario, de RedFID este año? ", 
      "En caso de haber respondido que sí ¿Con qué formador(es) de RedFID has trabajado? ",
      "En caso de haber respondido que sí ¿Te gustaría compartir el trabajo que has realizado por fuera de RedFID?",
      "¿Quieres compartir tu página web personal/profesional? (por ejemplo: Researchgate, Linkedin, Página universitaria, etc) ",
      "¿Cuáles son tus temas de interés en investigación? ",
      "¿Qué temas te motivan en tu rol de formador? ",
      "En 5 líneas, comparte una breve descripción de tu trayectoria para que la comunidad RedFID pueda conocerte mejor (por ejemplo: carrera, trayectoria profesional, lugares donde has trabajado, etc) ",
      "Indique su nombre y apellido",
      "_encuestra_encontrada",
    ];

//  Eliminar columnas específicas
function removeColumns(data, colsToRemove = []) {
  return data.map((row) => {
    const newRow = { ...row };
    colsToRemove.forEach((col) => delete newRow[col]);
    return newRow;
  });
}

//  Eliminar filas según condición
function removeRows(data, conditionFn) {
  return data.filter((row) => !conditionFn(row));
}

export async function parseExcel(participantesFile, encuestaFile) {
  try {
    // 1) Cargar ambos archivos con fetch
    console.log('Cargando archivos')
    const [respPart, respEnc] = await Promise.all([
      fetch(participantesFile),
      fetch(encuestaFile),
    ]);

    if (!respPart.ok) {
      throw new Error("No se pudo cargar el archivo de PARTICIPANTES");
    }
    if (!respEnc.ok) {
      throw new Error("No se pudo cargar el archivo de ENCUESTA");
    }

    const [bufferPart, bufferEnc] = await Promise.all([
      respPart.arrayBuffer(),
      respEnc.arrayBuffer(),
    ]);

    // 2) Parsear PARTICIPANTES (encabezado anidado en filas 2 y 3, datos desde 4)
    const participantes = (() => {
      const workbook = XLSX.read(bufferPart, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      if (rows.length < 4) return [];

      // fila 2 → índice 1 (padre)
      // fila 3 → índice 2 (hijo)
      // datos desde fila 4 → índice 3
      const parentHeader = rows[1];
      const childHeader = rows[2];

      let lastNonEmptyParent = "";
      const headers = parentHeader.map((h1, i) => {
        let p = (h1 || "").toString().trim();
        const c = (childHeader[i] || "").toString().trim();

        // Heredar encabezado padre cuando está vacío
        if (!p && lastNonEmptyParent) {
          p = lastNonEmptyParent;
        }
        if (p) {
          lastNonEmptyParent = p;
        }

        if (p && c) return `${p} - ${c}`; // ej: "CURSO - Iniciaron curso"
        if (p && !c) return p;
        if (!p && c) return c;
        return `col_${i}`;
      });

      const dataRows = rows.slice(3);

      return dataRows
        .filter((row) => row.some((cell) => cell !== ""))
        .map((row) => {
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = row[i];
          });
          return obj;
        });
    })();

    // 3) Parsear ENCUESTA (header en fila 0, datos desde fila 3)
    const encuesta = (() => {
      const workbook = XLSX.read(bufferEnc, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      if (rows.length < 4) return [];

      const header = rows[0];      // encabezado
      const dataRows = rows.slice(3); // datos desde fila 3

      return dataRows
        .filter((row) => row.some((cell) => cell !== ""))
        .map((row) => {
          const obj = {};
          header.forEach((h, i) => {
            obj[h] = row[i];
          });
          return obj;
        });
    })();

    // 4) MERGE por ID (LEFT JOIN desde PARTICIPANTES)
    const encuestaById = new Map(
      encuesta
        .filter((e) => e.ID !== "" && e.ID != null)
        .map((e) => [String(e.ID), e])
    );

    const merged = participantes.map((p) => {
      const id = String(p.ID); // aseguramos comparar como string
      const enc = encuestaById.get(id);

      if (!enc) {
        return {
          ...p,
          _encuesta_encontrada: false,
        };
      }

      // Evitamos duplicar ID
      const { ID: _id, ...encSinID } = enc;

      return {
        ...p,
        ...encSinID,
        _encuesta_encontrada: true,
      };
    });
    // 5) Agregar columna region_id usando REGION_TO_CODE
    const mergedWithRegion = merged.map((row) => {
      const rawRegion = row["Región"]; // 👈 OJO: usa el nombre exacto de la columna
      if (!rawRegion) {
        return { ...row, region_id: null };
      }

      const regionKey = String(rawRegion).trim();
      const regionCode = REGION_TO_CODE[regionKey] ?? null;

      return {
        ...row,
        region_id: regionCode,
      };
    });


    // 6) Limpieza de columnas innecesarias
     

    let cleaned = removeColumns(mergedWithRegion, colsToRemove);

    console.log("Merge final:", cleaned.slice(0, 3));

    return cleaned;
  } catch (error) {
    console.error("Error en parseExcel (participantes + encuesta + merge):", error);
    return [];
  }
}
