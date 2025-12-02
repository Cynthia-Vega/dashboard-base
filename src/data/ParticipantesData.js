// src/data/useParticipantesData.js
import { useEffect, useMemo, useState } from "react";
import { parseExcel } from "../utils/parseExcel";

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

const normalize = (v) =>
  (v || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

// para encontrar el nombre REAL de la columna
const findColumnKey = (row, searchTerm) => {
  if (!row) return null;
  const target = normalize(searchTerm);
  const keys = Object.keys(row);

  for (const key of keys) {
    const nk = normalize(key); // ej: "REGION - CURSO", "GENERO - PARTICIPANTE"
    if (nk.includes(target)) {
      return key;
    }
  }
  return null;
};

export function ParticipantesData() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    parseExcel("/participantes.xlsx").then((data) => {
      console.log("JSON limpio desde Excel:", data.slice(0, 3));
      setRows(data);
    });
  }, []);

  // detectar nombres REALES de las columnas que nos interesan
  const columnKeys = useMemo(() => {
    if (rows.length === 0) return {};

    const sample = rows[0];
    const regionKey = findColumnKey(sample, "region");
    const generoKey = findColumnKey(sample, "genero");
    const universidadKey = findColumnKey(sample, "universidad");

    console.log("Columnas que usaremos:", { regionKey, generoKey, universidadKey });
    return { regionKey, generoKey, universidadKey };
  }, [rows]);

  const byRegionForMap = useMemo(() => {
    const { regionKey } = columnKeys;
    if (!regionKey) {
      console.warn("No se encontró columna de Región");
      return [];
    }

    const counts = {};

    rows.forEach((r) => {
      const rawRegion = r[regionKey]; // ej: "RM", "IX", "X"
      if (!rawRegion) return;

      const regNorm = normalize(rawRegion); // "RM", "IX", etc.
      const cod = REGION_TO_CODE[regNorm];
      if (!cod) return;

      counts[cod] = (counts[cod] || 0) + 1;
    });

    const result = Object.entries(counts).map(([cod, value]) => ({
      id: String(cod),
      value,
    }));

    console.log("Datos para mapa por región:", result);
    return result;
  }, [rows, columnKeys]);

  const totalPorGenero = useMemo(() => {
    const { generoKey } = columnKeys;
    if (!generoKey) return { HOMBRE: 0, MUJER: 0, OTRO: 0 };

    const counts = { HOMBRE: 0, MUJER: 0, OTRO: 0 };

    rows.forEach((r) => {
      const g = normalize(r[generoKey]);
      if (!g) return;
      if (g.includes("HOMBRE")) counts.HOMBRE += 1;
      else if (g.includes("MUJER")) counts.MUJER += 1;
      else counts.OTRO += 1;
    });

    console.log("Totales por género:", counts);
    return counts;
  }, [rows, columnKeys]);

  const totalPorUniversidad = useMemo(() => {
    const { universidadKey } = columnKeys;
    if (!universidadKey) return {};

    const counts = {};
    rows.forEach((r) => {
      const u = r[universidadKey];
      if (!u) return;
      counts[u] = (counts[u] || 0) + 1;
    });

    console.log("Totales por universidad:", counts);
    return counts;
  }, [rows, columnKeys]);

  return {
    rows,
    byRegionForMap,
    totalPorGenero,
    totalPorUniversidad,
  };
}

