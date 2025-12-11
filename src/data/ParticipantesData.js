// src/data/useParticipantesData.js
import { useEffect, useState } from "react";
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
  return Object.entries(counts).map(([key, count]) => ({
    id: key,
    label: key,
    value: count,
  }));
}



function cumulativeFrequency(data, columnName) {
  if (!Array.isArray(data)) return [];

  // usar frecuency normal
  const base = frecuency(data, columnName);

  // ordenar por id (año)
  const sorted = [...base].sort((a, b) => Number(a.id) - Number(b.id));

  // calcular acumulado
  let acc = 0;
  
  return sorted.map((item) => {
    acc += item.value;
    return {
      id: item.id,
      label: item.label,
      value: acc,
    };
  });
}

function categorizeByExperience(data, columnName) {
  if (!Array.isArray(data)) return [];

  const counts = {
    novel: 0,
    intermedio: 0,
    experto: 0,
  };

  data.forEach((row) => {
    let years = row[columnName];

    if (years === null || years === undefined) return;

    years = Number(years);

    if (isNaN(years)) return;

    if (years >= 0 && years <= 5) {
      counts.novel += 1;
    } else if (years >= 6 && years <= 11) {
      counts.intermedio += 1;
    } else if (years >= 12) {
      counts.experto += 1;
    }
  });

  return [
    { id: "novel", label: "novel", value: counts.novel },
    { id: "intermedio", label: "intermedio", value: counts.intermedio },
    { id: "experto", label: "experto", value: counts.experto },
  ];
}





export function ParticipantesData() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const merged = await parseExcel("/participantes.xlsx", "/encuesta.xlsx");
        console.log("JSON limpio desde Excel:", merged);
        setRawData(merged);
      } catch (err) {
        console.error("Error cargando datos de participantes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);






  // ej 1: data para un gráfico de pie según cualquier columna
  const frecuencyData = (columnName) => frecuency(rawData, columnName);
  const cumulativeFrequencyData = (columnName) => cumulativeFrequency(rawData, columnName)
  const experienceLevelsData = (columnName) => categorizeByExperience(rawData, columnName);

  // ej 2: podrías agregar más helpers, por ejemplo:
  // const getBarData = (columnName) => buildNivoBarData(rawData, columnName);
  // const getGeoData = () => buildGeoData(rawData, "region_id");

  return {
    loading,
    rawData,      // por si algún gráfico quiere trabajar directo con la base
    frecuencyData,   // función genérica para pie
    cumulativeFrequencyData,
    experienceLevelsData
  };
}
