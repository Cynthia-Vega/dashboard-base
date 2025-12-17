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

function isMarked(v) {
  if (v === null || v === undefined) return false;

  if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
  if (typeof v === "boolean") return v;

  const s = String(v).trim().toLowerCase();
  if (!s) return false;

  // marcas típicas en planillas
  return ["1", "x", "si", "sí", "true", "ok", "✔"].includes(s);
}

function getColumns(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return Object.keys(data[0] || {});
}

/**
 * Cuenta eventos por COLUMNA (cada columna = un evento específico)
 * y también agrega por TIPO (Encuentros, Reuniones, etc.)
 */
function eventsFrequencyAll(data, opts = {}) {
  if (!Array.isArray(data)) return { byEvent: [], byType: [] };

  const {
    // patrones que definen qué columnas son eventos
    typeMatchers = [
      { type: "Encuentros", regex: /encuentro/i },
      { type: "Reuniones", regex: /^reuni[oó]n/i },
      { type: "Talleres", regex: /^taller/i },
      { type: "Lanzamientos", regex: /lanzamiento/i },
      { type: "Webinars", regex: /webinar/i },
    ],
    // cosas que NO quieres contar como evento
    excludeMatchers = [
      /^curso\s*-/i,
      /^compromiso/i,
      /^consentimiento/i,
      /^direcci[oó]n de correo/i,
      /^id$/i,
    ],
  } = opts;

  const cols = getColumns(data);

  // columnas candidatas a evento
  const eventCols = cols.filter((c) => {
    if (excludeMatchers.some((rx) => rx.test(c))) return false;
    return typeMatchers.some((m) => m.regex.test(c));
  });

  // conteo por columna (evento específico)
  const countsByEvent = {};
  data.forEach((row) => {
    eventCols.forEach((col) => {
      if (isMarked(row[col])) {
        countsByEvent[col] = (countsByEvent[col] || 0) + 1;
      }
    });
  });

  const byEvent = Object.entries(countsByEvent)
    .map(([key, count]) => ({ id: key, label: key, value: count }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // conteo por tipo (suma de columnas del tipo)
  const typeTotals = {};
  typeMatchers.forEach((m) => (typeTotals[m.type] = 0));

  byEvent.forEach((ev) => {
    const match = typeMatchers.find((m) => m.regex.test(ev.id));
    if (match) typeTotals[match.type] += ev.value;
  });

  const byType = Object.entries(typeTotals).map(([t, v]) => ({
    id: t,
    label: t,
    value: v,
  }));

  return { byEvent, byType };
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
  const eventsData = (opts) => eventsFrequencyAll(rawData, opts);


  // ej 2: podrías agregar más helpers, por ejemplo:
  // const getBarData = (columnName) => buildNivoBarData(rawData, columnName);
  // const getGeoData = () => buildGeoData(rawData, "region_id");

  return {
    loading,
    rawData,      // por si algún gráfico quiere trabajar directo con la base
    frecuencyData,   // función genérica para pie
    cumulativeFrequencyData,
    experienceLevelsData,
    eventsData,
  };
}
