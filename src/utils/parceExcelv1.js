// src/utils/parseParticipantesExcel.js
import * as XLSX from "xlsx";

export async function parseParticipantesExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target.result;

        // Leemos el workbook
        const workbook = XLSX.read(data, { type: "binary" });

        // Tomamos la primera hoja
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Leemos todo como matriz (cada fila es un array)
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1, // <- importante: no usa la primera fila como headers
          defval: "", // celdas vacías como ""
        });

        if (rows.length < 3) {
          return resolve([]);
        }

        // Suponemos:
        // fila 0: headers "grandes" (ID, Nombre, Género, ..., CURSO, Taller, etc.)
        // fila 1: subheaders (Iniciaron curso, Finalizaron módulos, ...)
        const header1 = rows[0];
        const header2 = rows[1];

        // Construimos nombres de columnas combinando header1 y header2
        const headers = header1.map((h1, idx) => {
          const h2 = header2[idx];

          // Si hay header en las dos filas, los juntamos
          if (h1 && h2) return `${h1} - ${h2}`;
          // Si solo hay uno, usamos ese
          if (h2) return h2;
          if (h1) return h1;

          // Si no hay nada, inventamos un nombre
          return `col_${idx}`;
        });

        // El resto de filas son datos
        const dataRows = rows.slice(2);

        // Convertimos cada fila (array) en objeto usando los headers
        const jsonData = dataRows
          .filter((row) => row.some((cell) => cell !== "")) // filtramos filas totalmente vacías
          .map((row) => {
            const obj = {};
            headers.forEach((h, i) => {
              obj[h] = row[i];
            });
            return obj;
          });

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);

    reader.readAsArrayBuffer(file);
  });
}
