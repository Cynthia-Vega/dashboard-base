import * as XLSX from "xlsx";

/* =========================
   Constantes
   ========================= */

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

const University = {
  USACH: "Universidad de Santiago de Chile",
  UCT: "Universidad Católica de Temuco",
  UC: "Pontificia Universidad Católica de Chile",
  UACH: "Universidad Austral de Chile",
  UOH: "Universidad de O'Higgins",
  UST: "Universidad Santo Tomás",
  UCSH: "Universidad Católica Silva Henríquez",
  USS: "Universidad San Sebastián",
  ULAGOS: "Universidad de los Lagos",
  UCHILE: "Universidad de Chile",
  UDEC: "Universidad de Concepción",
  UMAG: "Universidad de Magallanes",
  UDA: "Universidad de Atacama",
  USERENA: "Universidad de La Serena",
  UTALCA: "Universidad de Talca",
  UTA: "Universidad de Tarapacá",
  UCSC: "Universidad Católica de la Santísima Concepción",
  UDLA: "Universidad de Las Américas",
  UFT: "Universidad Finis Terrae",
  UBB: "Universidad del Bío-Bío",
  UMCE: "Universidad Metropolitana de Ciencias de la Educación",
  UFRO: "Universidad de La Frontera",
  UNAB: "Universidad Andrés Bello",
  UCN: "Universidad Católica del Norte",
  UAH: "Universidad Alberto Hurtado",
  UANDES: "Universidad de los Andes",
  PUCV: "Pontificia Universidad Católica de Valparaíso",
  UCM: "Universidad Católica del Maule",
  UPLA: "Universidad de Playa Ancha",
  UBO: "Universidad Bernardo O'Higgins",
  UDD: "Universidad del Desarrollo",
  UNAP: "Universidad Arturo Prat",
  UDP: "Universidad Diego Portales",
};

const colsToRemove = [
  "col_0",
  "Adjunte una foto para actualizar tu perfil",
  "Años de formador ",
  "Columna 25",
  "Inserte ",
  "CURSO - Iniciaron curso",
  "CURSO - Documento incremental",
  "Compromiso (completar)",
  "Consentimiento (completar)",
  "Dirección de correo electrónico",
  "Carrera",
  "Nombre",
  "¿En qué universidad(es) trabajas? ",
  "¿Tienes otros intereses que te gustaría compartir? ",
  "¿Qué esperas, como formador y usuario, de RedFID este año? ",
  "En caso de haber respondido que sí ¿Con qué formador(es) de RedFID has trabajado? ",
  "En caso de haber respondido que sí ¿Te gustaría compartir el trabajo que has realizado por fuera de RedFID?",
  "¿Quieres compartir tu página web personal/profesional? (por ejemplo: Researchgate, Linkedin, Página universitaria, etc) ",
  "¿Cuáles son tus temas de interés en investigación? ",
  "¿Qué temas te motivan en tu rol de formador? ",
  "En 5 líneas, comparte una breve descripción de tu trayectoria para que la comunidad RedFID pueda conocerte mejor (por ejemplo: carrera, trayectoria profesional, lugares donde has trabajado, etc) ",
  "_encuestra_encontrada",
  "_participante_encontrado"
];

const PROGRAM_LABEL = {
  educacion_media: "Educación en Media",
  educacion_basica: "Educación en Básica",
  educacion_parvularia: "Educación en Parvularia",
  formacion_pedagogica: "Formación pedagógica",
  postgrado: "Postgrado",
  otras_carreras: "Otras carreras",
};

const Columns = {
  "Jornada lanzamiento Atacama": "1er Encuentro Atacama",
  "3er  Encuentro Magallanes": "3er Encuentro Magallanes",
  "Presentó Poster": 'Presenta Osorno',
  "Presentó Trabajo": 'Presenta Magallanes',
  "Indique su nombre y apellido": 'Nombre y apellido',
  "Indique su título profesional": "Título",
  "Año en que comenzaste a trabajar como formador/a.": 'Año formador',
  "Indique ciudad donde reside": 'Ciudad',
  "¿En qué año te uniste a RedFID?": 'Año RedFID',
  "¿En qué programa(s) impartes clases como formador?": 'Programas',
  "Taller N° especial Revista 2024": 'Reunión informativa del número especial'
}

/* =========================
   Utilidades generales
   ========================= */

function removeColumns(data, cols = []) {
  return data.map((row) => {
    const newRow = { ...row };
    cols.forEach((c) => delete newRow[c]);
    return newRow;
  });
}

/* =========================
   Normalización texto
   ========================= */

const stripAccents = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const norm = (s) =>
  stripAccents(s)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/* =========================
   Programa -> categorías
   ========================= */

function shouldIgnoreProgramText(t) {
  if (!t) return true;

  if (
    t === "ninguno" ||
    t.includes("por ahora ninguno") ||
    t.includes("por el momento ninguno") ||
    t.includes("actualmente ninguno")
  ) {
    return true;
  }

  if (t === "universidad san sebastian") return true;

  return false;
}


function splitProgramParts(cellRaw) {
  const t = norm(cellRaw);
  if (shouldIgnoreProgramText(t)) return [];

  const withPipes = t.replace(/\b\d+\)\s*/g, "|");

  let parts = withPipes
    .split(/[;,/|\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const out = [];
  for (const p of parts) {
    const pp = norm(p);

    const looksLikeList =
      pp.includes(" y ") &&
      /(pedagog|magister|doctor|postitulo|programa|pregrado|postgrado|educacion|carrera)/.test(pp);

    const dontSplitBecauseSingleProgram =
      /(matemat.* y .*comput)/.test(pp) || // "matemática y computación"
      /(mencion.*matemat.* y .*cienc)/.test(pp) || // "mención matemática y ciencias"
      /(fisica y matemat|matematicas y fisica)/.test(pp); // "física y matemática"

    if (looksLikeList && !dontSplitBecauseSingleProgram) {
      pp.split(" y ")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => out.push(x));
    } else {
      out.push(p);
    }
  }

  return out;
}


function detectProgramCategories(cellRaw) {
  const t = norm(cellRaw);
  if (shouldIgnoreProgramText(t)) return [];


  if (
    /\bpregrado\b/.test(t) &&
    /matemat/.test(t) &&
    /(practic|practica|practicas)/.test(t)
  ) {
    return ["educacion_basica"];
  }

  const parts = splitProgramParts(cellRaw);
  const cats = [];
  const add = (c) => cats.push(c);

  for (const part of parts) {
    const p = norm(part);
    if (!p) continue;
    if (p === "universidad san sebastian") continue;


    if (p.includes("formacion continua")) continue;


    if (/\blicenciatura\b/.test(p)) {
      add("otras_carreras");
      continue;
    }


    if (/\bespecial\b/.test(p)) {
      add("otras_carreras");
      continue;
    }

    if (p.includes("postitulo")) {
      add("postgrado");
      continue;
    }

    if (/(magister|master|maestr|doctorad|postdoc|postdoctor|postgrado)/.test(p)) {
      add("postgrado");
      continue;
    }

    if (
      p.includes("programa de educacion media para licenciados") ||
      p.includes("programa de educacion media para licenciados y titulados")
    ) {
      add("formacion_pedagogica");
      continue;
    }

    if (
      p.includes("formacion pedagogic") ||
      p.includes("programa de formacion pedagogic") ||
      p.includes("programa formacion pedagogic") ||
      /\bpemmf\b/.test(p) ||
      /\bpfp\b/.test(p)
    ) {
      add("formacion_pedagogica");
      continue;
    }

    if (/(parvular|parvulo|parvulos|educacion de parvulos)/.test(p)) {
      add("educacion_parvularia");
      continue;
    }

    const isBasica =
      /(educacion basica|educacion general basica|general basica|\bbasica\b|pedagogia en educacion basica)/.test(p);

    const isMedia =
      /(pedagogia\s+media|ensenanza\s+media|educacion\s+media|media\s+en\s+matemat)/.test(p) ||
      /\bpedagogia\b.*\bmatemat/.test(p) ||
      /\beducacion matematica\b/.test(p) ||
      /(pedagogia\s+en\s+fisica\s+y\s+matemat|fisica y matemat|matematicas y fisica)/.test(p) ||
      (/\bbasica\b/.test(p) && p.includes("mencion") && p.includes("matemat"));

    if (isBasica) add("educacion_basica");

    if (isMedia) {
      add("educacion_media");
      continue;
    }

    if (/(ingenieria|minas|mecanica|civil|modelamiento|ingles|biologia|diferencial)/.test(p)) {
      add("otras_carreras");
      continue;
    }

    if (/(ciencias|computacion)/.test(p)) {
      add("otras_carreras");
      continue;
    }
  }

  if (cats.length === 0 && !shouldIgnoreProgramText(t)) cats.push("otras_carreras");

  return cats;
}

function experienceFromStartYear(startYear, currentYear = new Date().getFullYear()) {
  const y = Number(startYear);
  if (!Number.isFinite(y)) return null;

  const years = currentYear - y;
  if (years < 0) return null;

  if (years <= 5) return "Novel";
  if (years <= 11) return "Intermedio";
  return "Experto";
}




/* =========================
   parseExcel
   ========================= */

export async function parseExcel(participantesFile, encuestaFile) {
  try {
    console.log("Cargando archivos");
    const [respPart, respEnc] = await Promise.all([
      fetch(participantesFile),
      fetch(encuestaFile),
    ]);

    if (!respPart.ok) throw new Error("No se pudo cargar el archivo de PARTICIPANTES");
    if (!respEnc.ok) throw new Error("No se pudo cargar el archivo de ENCUESTA");

    const [bufferPart, bufferEnc] = await Promise.all([
      respPart.arrayBuffer(),
      respEnc.arrayBuffer(),
    ]);

    // Parsear PARTICIPANTES (encabezado anidado)
    const participantes = (() => {
      const workbook = XLSX.read(bufferPart, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      if (rows.length < 4) return [];

      const parentHeader = rows[1];
      const childHeader = rows[2];

      let lastNonEmptyParent = "";
      const headers = parentHeader.map((h1, i) => {
        let p = (h1 || "").toString().trim();
        const c = (childHeader[i] || "").toString().trim();

        if (!p && lastNonEmptyParent) p = lastNonEmptyParent;
        if (p) lastNonEmptyParent = p;

        if (p && c) return `${p} - ${c}`;
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

    // Parsear ENCUESTA
    const encuesta = (() => {
      const workbook = XLSX.read(bufferEnc, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      if (rows.length < 4) return [];

      const header = rows[0];
      const dataRows = rows.slice(2);

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

    // MERGE por ID (LEFT JOIN desde ENCUESTA)
    const participantesById = new Map(
      participantes
        .filter((p) => p.ID !== "" && p.ID != null)
        .map((p) => [String(p.ID), p])
    );

    const merged = encuesta
      .filter((e) => e.ID !== "" && e.ID != null)
      .map((e) => {
        const id = String(e.ID);
        const p = participantesById.get(id);

        if (!p) return { ...e, _participante_encontrado: false };

        const { ID: _id, ...pSinID } = p;
        return { ...e, ...pSinID, _participante_encontrado: true };
      });

    // region_id
    const mergedWithRegion = merged.map((row) => {
      const rawRegion = row["Región"];
      if (!rawRegion) return { ...row, region_id: null };

      const regionKey = String(rawRegion).trim();
      const regionCode = REGION_TO_CODE[regionKey] || null;

      return { ...row, region_id: regionCode };
    });

    //  nombre_universidad
    const mergedWithUniversity = mergedWithRegion.map((row) => {
      const rawUniversity = row["Universidad"];
      if (!rawUniversity) return { ...row, nombre_universidad: null };

      const universityKey = String(rawUniversity).trim();
      const universityName = University[universityKey] || null;

      return { ...row, nombre_universidad: universityName };
    });

    //  grado_final
    function getHighestDegree(raw) {
      if (!raw) return null;

      const ranking = {
        Licenciatura: 1,
        "Magíster": 2,
        Magister: 2,
        Doctorado: 3,
      };

      const parts = String(raw)
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      let best = null;
      let bestRank = -Infinity;

      parts.forEach((d) => {
        const normalized = d === "Magister" ? "Magíster" : d;
        const rank = ranking[normalized];

        if (rank && rank > bestRank) {
          bestRank = rank;
          best = normalized;
        }
      });

      return best || null;
    }

    const mergedWithDegree = mergedWithUniversity.map((row) => {
      const rawDegree = row["Grado académico"];
      const gradoFinal = getHighestDegree(rawDegree);
      return { ...row, grado_final: gradoFinal };
    });

    // programa_categorias + str
    const mergedWithProgram = mergedWithDegree.map((row) => {
      const programCol = Object.keys(row).find((k) => {
        const kk = norm(k);
        return kk.includes("en que programa") && kk.includes("impartes") && kk.includes("formador");
      });

      const rawProgram = programCol ? row[programCol] : "";
      const cats = detectProgramCategories(rawProgram);

      return {
        ...row,
        programa_categorias: cats, // ✅ array con repetidos
        programa_categorias_str: cats.map((c) => PROGRAM_LABEL[c] || c).join(", "),
      };
    });


    // nivel experiecia
    const mergedWithExperience = mergedWithProgram.map((row) => {
      const exp = experienceFromStartYear(row?.["Año en que comenzaste a trabajar como formador/a. "]);
      return { ...row, experience: exp };
    });


    // limpieza
    const remove = removeColumns(mergedWithExperience, colsToRemove);

    const cleaned = remove.map(o => Object.fromEntries(Object.entries(o).map(([k,v]) => [k.trim(), v])));

    // renombre columnas
    const renameCols = (rows, map) =>
      rows.map((o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [map[k] ?? k, v])));

    const newRows = renameCols(cleaned, Columns);

    // console.log("Merge final:", newRows.slice(0, 3));
    return newRows;
  } catch (error) {
    console.error("Error en parseExcel (participantes + encuesta + merge):", error);
    return [];
  }
}
