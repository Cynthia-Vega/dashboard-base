// src/data/useParticipantesData.js
import { useEffect, useMemo, useState } from "react";
import { parseExcel } from "../utils/parseExcel";



function frecuency(data, columnName) {
  if (!Array.isArray(data)) return [];

  const counts = {};

  data.forEach((row) => {
    let value = row[columnName];

    if (value === null || value === undefined) return;

    value = String(value).trim();
    if (!value) return;

    counts[value] = (counts[value] || 0) + 1;
  });
  console.log("Frecuency counts for column", columnName, ":", counts);
  return Object.entries(counts).map(([key, count]) => ({
    id: key,
    label: key,
    value: count,
  }));
}


export function ParticipantesData() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const merged = await parseExcel("/participantes.xlsx", "/encuesta.xlsx");
        console.log("JSON limpio desde Excel:");
        setRawData(merged);
      } catch (err) {
        console.error("Error cargando datos de participantes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔹 funciones auxiliares QUE USAN rawData ya cargado

  // ej 1: data para un gráfico de pie según cualquier columna
  const frecuencyData = (columnName) => frecuency(rawData, columnName);

  // ej 2: podrías agregar más helpers, por ejemplo:
  // const getBarData = (columnName) => buildNivoBarData(rawData, columnName);
  // const getGeoData = () => buildGeoData(rawData, "region_id");

  return {
    loading,
    rawData,      // por si algún gráfico quiere trabajar directo con la base
    frecuencyData,   // función genérica para pie
  };
}
