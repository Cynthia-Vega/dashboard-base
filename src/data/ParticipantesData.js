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

  const currentYear = new Date().getFullYear();

  const counts = { novel: 0, intermedio: 0, experto: 0 };

  data.forEach((row) => {
    const startYear = Number(row?.[columnName]);
    if (!Number.isFinite(startYear)) return;

    const years = currentYear - startYear;
    if (years < 0) return;

    if (years <= 5) counts.novel += 1;
    else if (years <= 11) counts.intermedio += 1;
    else counts.experto += 1;
  });

  return [
    { id: "novel", label: "novel", value: counts.novel },
    { id: "intermedio", label: "intermedio", value: counts.intermedio },
    { id: "experto", label: "experto", value: counts.experto },
  ];
}




// ✅ Mapa: nombre exacto -> carpeta abreviación + archivo
const UNI_IMG = {
  "Pontificia Universidad Católica de Chile": { folder: "PUC", file: "1.png" },
  "Pontificia Universidad Católica de Valparaíso": { folder: "PUCV", file: "1.png" },
  "Universidad Alberto Hurtado": { folder: "UAH", file: "1.png" },
  "Universidad Andrés Bello": { folder: "UNAB", file: "1.png" },
  "Universidad Arturo Prat": { folder: "UNAP", file: "1.png" },
  "Universidad Austral de Chile": { folder: "UACH", file: "1.png" },
  "Universidad Bernardo O'Higgins": { folder: "UBO", file: "1.png" },
  "Universidad Católica de la Santísima Concepción": { folder: "UCSC", file: "1.png" },
  "Universidad Católica de Temuco": { folder: "UCT", file: "1.png" },
  "Universidad Católica del Maule": { folder: "UCM", file: "1.png" },
  "Universidad Católica del Norte": { folder: "UCN", file: "1.png" },
  "Universidad Católica Silva Henríquez": { folder: "UCSH", file: "1.png" },
  "Universidad de Atacama": { folder: "UDA", file: "1.png" },
  "Universidad de Chile": { folder: "UCH", file: "1.png" },
  "Universidad de Concepción": { folder: "UDEC", file: "1.png" },
  "Universidad de La Frontera": { folder: "UFRO", file: "1.png" },
  "Universidad de La Serena": { folder: "USERENA", file: "1.png" },
  "Universidad de Las Américas": { folder: "UDLA", file: "1.png" },
  "Universidad del Bío-Bío": { folder: "UBB", file: "1.png" },
  "Universidad del Desarrollo": { folder: "UDD", file: "1.png" },
  "Universidad Diego Portales": { folder: "UDP", file: "1.png" },
  "Universidad de los Andes": { folder: "UANDES", file: "1.png" },
  "Universidad de los Lagos": { folder: "ULA", file: "1.png" },
  "Universidad de Magallanes": { folder: "UMAG", file: "1.png" },
  "Universidad de O'Higgins": { folder: "UOH", file: "1.png" },
  "Universidad de Playa Ancha": { folder: "UPLA", file: "1.png" },
  "Universidad de Santiago de Chile": { folder: "USACH", file: "1.png" },
  "Universidad de Talca": { folder: "UTALCA", file: "1.png" },
  "Universidad de Tarapacá": { folder: "UTA", file: "1.png" },
  "Universidad Finis Terrae": { folder: "UFT", file: "1.png" },
  "Universidad Metropolitana de Ciencias de la Educación": { folder: "UMCE", file: "1.png" },
  "Universidad San Sebastián": { folder: "USS", file: "1.png" },
  "Universidad Santo Tomás": { folder: "UST", file: "1.png" },
};

function getUniImgSrc(universityName) {
  const key = String(universityName ?? "").trim().replace(/\s+/g, " ");
  const ref = UNI_IMG[key];
  if (!ref) return null;
  return `/assets/universities/${ref.folder}/${ref.file}`;
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

  // dentro de ParticipantesData(), cuando ya tienes rawData cargado:

const programsCategoryCounts = () => {
  const counts = {
    media: 0,
    basica: 0,
    parvularia: 0,
    formacion_pedagogica: 0,
    postgrado: 0,
    otras_carreras: 0,
  };

  (rawData || []).forEach((row) => {
    const cats = row?.programa_categorias;
    if (!Array.isArray(cats)) return;

    // ✅ 1 por persona por categoría (tu regla)
    cats.forEach((c) => {
      if (counts[c] !== undefined) counts[c] += 1;
    });
  });

  return [
    { id: "media", label: "Media", value: counts.media },
    { id: "basica", label: "Básica", value: counts.basica },
    { id: "parvularia", label: "Parvularia", value: counts.parvularia },
    { id: "formacion_pedagogica", label: "Formación pedagógica", value: counts.formacion_pedagogica },
    { id: "postgrado", label: "Postgrado", value: counts.postgrado },
    { id: "otras_carreras", label: "Otras carreras", value: counts.otras_carreras },
  ];
};


function regionStats() {
  if (!Array.isArray(rawData)) return {};

  const norm = (v) => String(v ?? "").trim();
  const low = (v) => norm(v).toLowerCase();

  const by = new Map();

  rawData.forEach((row) => {
    const rid = norm(row?.region_id);
    if (!rid) return;
    if (!by.has(rid)) by.set(rid, []);
    by.get(rid).push(row);
  });

  const out = {};

  by.forEach((rows, rid) => {
    const participantsSet = new Set();
    const universitiesSet = new Set();
    const careersSet = new Set();
    const programsSet = new Set();

    rows.forEach((r) => {
      const p = low(r?.["Indique su nombre y apellido"]);
      if (p) participantsSet.add(p);

      const u = low(r?.["Universidad"]);
      if (u) universitiesSet.add(u);

      const c = low(r?.["Carrera"]);
      if (c) careersSet.add(c);

      const arr = Array.isArray(r?.programa_categorias) ? r.programa_categorias : [];
      arr.forEach((x) => {
        const k = low(x);
        if (k) programsSet.add(k);
      });
    });

    out[String(rid)] = {
      region_id: String(rid),
      participantes: participantsSet.size,
      universidades: universitiesSet.size,
      carreras: careersSet.size,
      programas: programsSet.size,
    };
  });

  return out; // { "13": { ... }, "5": { ... } }
}



  const frecuencyData = (columnName) => frecuency(rawData, columnName);
  const cumulativeFrequencyData = (columnName) => cumulativeFrequency(rawData, columnName);
  const experienceLevelsData = (columnName) => categorizeByExperience(rawData, columnName);
  const eventsData = (opts) => eventsFrequencyAll(rawData, opts);
  const universityImage = (universityName) => getUniImgSrc(universityName)


  return {
    loading,
    rawData,      // por si algún gráfico quiere trabajar directo con la base
    frecuencyData,   // función genérica para pie
    cumulativeFrequencyData,
    experienceLevelsData,
    eventsData,
    universityImage,
    programsCategoryCounts,
    regionStats
  };
}
