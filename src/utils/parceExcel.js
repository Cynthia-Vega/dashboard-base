import * as XLSX from "xlsx";

export async function parseExcel(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error("No se pudo cargar el archivo Excel");
    }

    const buffer = await response.arrayBuffer();

    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    if (rows.length < 3) return [];

    const header1 = rows[0];
    const header2 = rows[1];

    const headers = header1.map((h1, i) => {
      const h2 = header2[i];
      if (h1 && h2) return `${h1} - ${h2}`;
      if (h2) return h2;
      if (h1) return h1;
      return `col_${i}`;
    });

    const dataRows = rows.slice(2);

    return dataRows
      .filter((row) => row.some((cell) => cell !== ""))
      .map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i];
        });
        return obj;
      });
  } catch (error) {
    console.error(error);
    return [];
  }
}
