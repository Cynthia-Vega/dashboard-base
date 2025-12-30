import { useEffect, useState } from "react";
import { parseExcel } from "./parseExcel";



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

  return ["1", "x", "si", "sí", "true", "ok", "✔"].includes(s);
}

function getColumns(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return Object.keys(data[0] || {});
}


function eventsFrequencyAll(data, opts = {}) {
  if (!Array.isArray(data)) return { byEvent: [], byType: [] };

  const {
    typeMatchers = [
      { type: "Encuentros", regex: /encuentro/i },
      { type: "Reuniones", regex: /^reuni[oó]n/i },
      { type: "Talleres", regex: /^taller/i },
      { type: "Lanzamientos", regex: /lanzamiento/i },
      { type: "Webinars", regex: /webinar/i },
    ],

    excludeMatchers = [
      /^curso\s*-/i,
      /^compromiso/i,
      /^consentimiento/i,
      /^direcci[oó]n de correo/i,
      /^id$/i,
    ],
  } = opts;

  const cols = getColumns(data);


  const eventCols = cols.filter((c) => {
    if (excludeMatchers.some((rx) => rx.test(c))) return false;
    return typeMatchers.some((m) => m.regex.test(c));
  });


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

  const base = frecuency(data, columnName);

  const sorted = [...base].sort((a, b) => Number(a.id) - Number(b.id));

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


function usersBinary(data, binCol, userCol = "username") {
  if (!Array.isArray(data)) return [];

  return [
    ...new Set(
      data
        .filter((row) => isMarked(row?.[binCol]))
        .map((row) => row?.[userCol])
        .filter((u) => u != null && String(u).trim() !== "")
        .map((u) => String(u).trim())
    ),
  ];
}

function usersByCategory(data, catCol, userCol = "username", opts = {}) {
  const { normalize = true, includeEmpty = false, emptyLabel = "Sin dato" } = opts;
  if (!Array.isArray(data)) return {};

  const normCat = (v) => {
    if (!normalize) return v;
    const s = String(v ?? "").trim();
    return s === "" ? emptyLabel : s;
  };

  const acc = {};

  for (const row of data) {
    const user = row?.[userCol];
    if (user == null || String(user).trim() === "") continue;
    const u = String(user).trim();

    const rawCat = row?.[catCol];
    if (!includeEmpty && (rawCat == null || String(rawCat).trim() === "")) continue;

    const cat = normCat(rawCat);
    if (!acc[cat]) acc[cat] = new Set();
    acc[cat].add(u);
  }

  return Object.fromEntries(
    Object.entries(acc).map(([cat, set]) => [cat, [...set]])
  );
}



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



const programsCategoryCounts = () => {
  const counts = {
    educacion_media: 0,
    educacion_basica: 0,
    educacion_parvularia: 0,
    formacion_pedagogica: 0,
    postgrado: 0,
    otras_carreras: 0,
  };

  (rawData || []).forEach((row) => {
    const cats = row?.programa_categorias;
    if (!Array.isArray(cats)) return;


    cats.forEach((c) => {
      if (counts[c] !== undefined) counts[c] += 1;
    });
  });

  console.log(counts)
  return [
    { id: "educacion_media", label: "Educación Media", value: counts.educacion_media },
    { id: "educacion_basica", label: "Educación Básica", value: counts.educacion_basica },
    { id: "educacion_parvularia", label: "Educación Parvularia", value: counts.educacion_parvularia },
    { id: "formacion_pedagogica", label: "Formación pedagógica", value: counts.formacion_pedagogica },
    { id: "postgrado", label: "Postgrado", value: counts.postgrado },
    { id: "otras_carreras", label: "Otras carreras", value: counts.otras_carreras },
  ];
};


function regionStats() {
  if (!Array.isArray(rawData)) return {};

  const norm = (v) => String(v ?? "").trim();

  const titleCase = (s) =>
    String(s ?? "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/(^|\s|[-(])([a-záéíóúñ])/g, (m, p1, p2) => p1 + p2.toUpperCase());

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
      // Participantes
      const pRaw = norm(r?.["Nombre y apellido"]);
      if (pRaw) participantsSet.add(pRaw);

      // Universidades (según tu columna)
      const uRaw = norm(r?.["nombre_universidad"]);
      if (uRaw) universitiesSet.add(uRaw);

      // Carreras
      const cRaw = norm(r?.["Título"]);
      if (cRaw) careersSet.add(cRaw);

      // Programas (string o array)
      const rawProg = r?.programa_categorias_str;

      const arr = Array.isArray(rawProg)
        ? rawProg
        : typeof rawProg === "string"
          ? rawProg.split(/[,;|]/)
          : [];

      arr.forEach((x) => {
        const kRaw = norm(x).replace(/^"+|"+$/g, "");
        if (kRaw) programsSet.add(kRaw);
      });
    });

    const participantes_items = Array.from(participantsSet)
      .map(titleCase)
      .sort((a, b) => a.localeCompare(b, "es"));

    const universidades_items = Array.from(universitiesSet)
      .map(titleCase)
      .sort((a, b) => a.localeCompare(b, "es"));

    const carreras_items = Array.from(careersSet)
      .map(titleCase)
      .sort((a, b) => a.localeCompare(b, "es"));

    const programas_items = Array.from(programsSet)
      .map(titleCase)
      .sort((a, b) => a.localeCompare(b, "es"));

    out[String(rid)] = {
      region_id: String(rid),

      participantes: participantes_items.length,
      universidades: universidades_items.length,
      carreras: carreras_items.length,
      programas: programas_items.length,

      participantes_items,
      universidades_items,
      carreras_items,
      programas_items,
    };
  });

  return out;
}




  const frecuencyData = (columnName) => frecuency(rawData, columnName);
  const cumulativeFrequencyData = (columnName) => cumulativeFrequency(rawData, columnName);
  const eventsData = (opts) => eventsFrequencyAll(rawData, opts);
  const universityImage = (universityName) => getUniImgSrc(universityName)
  const usersEvents = (binCol, userCol = "username") =>
  usersBinary(rawData, binCol, userCol);

  const usersCat = (catCol, userCol = "username", opts = {}) =>
  usersByCategory(rawData, catCol, userCol, opts);


  return {
    loading,
    rawData,     
    frecuencyData,   
    cumulativeFrequencyData,
    eventsData,
    universityImage,
    programsCategoryCounts,
    regionStats,
    usersEvents,
    usersCat
  };
}
