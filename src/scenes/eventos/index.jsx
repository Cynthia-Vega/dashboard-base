import { Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { ParticipantesData } from "../../data/ParticipantesData";

// ✅ targets
import TargetDesc from "../../components/targets/TargetDesc";

import GroupsIcon from "@mui/icons-material/Groups";
import VideocamIcon from "@mui/icons-material/Videocam";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HandymanIcon from "@mui/icons-material/Handyman";

/**
 * ✅ Aquí defines TÍTULOS y DESCRIPCIONES por columna exacta (id exacto de byEvent)
 * Ejemplo:
 * WEBINAR_META["Webinar 1 - 2025"] = { title: "Webinar 1: ...", desc: "..." }
 */
const WEBINAR_META = {
  Webinar: {
    title: "Webinar - 2023",
    subtitle: "Preocupaciones de los estudiantes a lo largo de su formación profesional: implicancias para la formación inicial del profesorado.",
    desc:'En este Webinar se comparten los resultados de un estudio orientado a identificar las preocupaciones sobre la enseñanza y el aprendizaje que poseen estudiantes a lo largo de su formación inicial.'
  },
};

const ENCUENTRO_META = {
  "1er Encuentro Atacama": {
    title: "1er Encuentro - Atacama",
    subtitle: 'Universidad de Atacama, Copiapó',
    desc: "Primer Encuentro Nacional de Formadores de Profesores de Matemáticas: Abriendo espacios para la colaboración y la innovación en la Formación Inicial Docente ",
  },
  "2do Encuentro Osorno": {
    title: "2do Encuentro - Osorno",
    subtitle: 'Universidad de los Lagos, Osorno',
    desc: "Segundo encuentro nacional de formadores en Matemática RedFID: Innovar en Comunidad: Construyendo Redes para Transformar",
  },
  "3er Encuentro Magallanes": {
    title: "3er Encuentro - Magallanes",
    subtitle: 'Universidad de Magallanes, Punta Arenas',
    desc: "Tercer Encuentro Nacional de Formadores de Profesores en Matemáticas: Consolidando una red de formadores y formadoras para la innovación en la formación docente en matemáticas",
  },
};

const REUNION_META = {
  // "Nombre exacto columna": { title: "Título bonito", desc: "Descripción..." },
};

const TALLER_META = {
  "Taller n°1 2023": {
    title: "Taller N° 1",
    subtitle: 'Orientaciones para realizar revisiones de pares',
    desc: "En este taller se comparten diversas estrategias clave en la revisión de proyectos y artículos.",
  },
  "Taller n°2 2023": {
    title: "Taller N° 2",
    subtitle: 'Orientaciones para el trabajo en comunidades RedFID',
    desc: "En este taller se comparten las principales funcionalidades de la plataforma RedFID que potencian el trabajo colaborativo entre las personas.",
  },
  "Taller n°3 2023": {
    title: "Taller N° 3",
    subtitle: 'Taller de amistad crítica comunidad RedFID',
    desc: "En este taller se comparten estrategias concretas y recomendaciones para desarrollar la amistad crítica en el contexto de un trabajo colaborativo.",
  },
  "Taller n°4 2023": {
    title: "Taller N° 4",
    subtitle: 'Ideas para investigar nuestras prácticas como educadores matemáticos',
    desc: "En este taller se compartirán ejemplos de formadores de matemáticas que han investigado su práctica docente.",
  },
  "Taller n°5 2023": {
    title: "Taller N° 5",
    subtitle: '¿Como hacer investigación a partir de actividades de aprendizaje matemático para futuros profesores?',
    desc: "En este taller se comparte un ejemplo de cómo utilizar actividades de aprendizaje que los formadores diseñan para realizar investigación sobre el conocimiento matemático de los profesores en formación.",
  },
  "Taller n°6 2023": {
    title: "Taller N° 6",
    subtitle: 'Recolectando evidencia de mi trabajo en el aula',
    desc: "En este taller se discuten algunos aspectos claves de tener en cuenta al recolectar evidencias en contextos educativos y en la formación de profesores.",
  },
  "Taller n°7 2023": { 
    title: "Taller N° 7",
    subtitle:'Título...',
    desc: "Descripción..." },

  "Taller N° 1 2024": { 
    title: "Taller N° 8",
    subtitle:'De las matemáticas de los juegos, al juego de las matemáticas',
     desc: "En este taller se discute cómo el contexto lúdico que aportan los juegos de mesa, de estrategia, de azar y de recreaciones matemáticas es un poderoso recurso para generar situaciones de aprendizaje matemático." },
  "Taller N° 2  2024": { 
    title: "Taller N° 9",
    subtitle:'¿Qué necesitamos como formadores y formadoras para formar al profesorado de matemáticas?',
    desc: "En este taller formadores pertenecientes a RedFID discuten sobre los principales desafíos que enfrentan a nivel institucional académico e investigativo cuando forman a futuros profesores de matemática." },
  "Taller N° 3 2024": { 
    title: "Taller N° 10",
    subtitle:'Cómo investigar la propia práctica favorece el aprendizaje de los profesores en formación: cuatro experiencias para analizar',
    desc: "En este taller se comparten los resultados de cuatro proyectos de indagación que abordan el rol y la mirada del formador en su enseñanza y la forma en que el estudio de la propia práctica contribuye al aprendizaje de los profesores en formación." },
  "Taller N° 4 2024": { 
    title: "Taller N° 11",
    subtitle:'Trabajo colaborativo entre formadores en matemáticas: potencialidades y restricciones',
    desc: "En este taller se comparten investigaciones y experiencias prácticas sobre el trabajo colaborativo que se puede desarrollar entre formadores en matemática." },
  "Taller N° especial Revista 2024": { 
    title: "Revista 2024",
    subtitle:'',
    desc: "Descripción..." },
  "Taller N° 1 2025": {
    title: "Taller N° 12",
    subtitle:'Matcon: matemáticas conectadas con los desafíos educativos de los docentes',
    desc: "En este taller se comparte MatCon, una plataforma de recursos educativos interactivos e innovadores que permite gestionar una enseñanza de la matemática orientada a las motivaciones y preocupaciones de niños y jóvenes, ayudándoles a dar sentido a problemas relevantes de su entorno y a involucrarse en sus soluciones.",
  },
  "Taller N° 2 2025": {
    title: "Taller N° 13",
    subtitle:'Modelar el enseñar a enseñar: Prácticas de modelización en la formación de docentes de matemática',
    desc: "En este taller se invita a reflexionar sobre la modelización como estrategia para vincular teoría y práctica en la enseñanza de la matemática. A partir de casos reales, se analizan formas de modelización y su aporte al conocimiento didáctico del formador, así como su potencial para enriquecer la formación de futuros docentes.",
  },
  "Taller N° 3 2025": { 
    title: "Taller N° 14",
    subtitle:'Matemática y formación ciudadana: cuentos para la sala de clases (segundo día)',
    desc: "En este taller se comparte el cuento como recurso de enseñanza, utilizando las matemáticas como herramienta para comprender el mundo en que vivimos desde una mirada crítica. " },
  "Taller N° 4 2025": { 
    title: "Taller N° 15",
    subtitle:'De la postulación a la adjudicación: Experiencias y aprendizajes en la postulación a un Fondecyt de Iniciación',
    desc: "En este taller, cuatro miembros de nuestra comunidad comparten, a partir de su propia experiencia, los principales desafíos y aprendizajes que enfrentaron al postular un proyecto Fondecyt de Iniciación. Esta instancia busca que los futuros formadores y formadoras conozcan mejor estos procesos, comprendan sus implicancias y consideren los aspectos clave para una postulación exitosa." },
};

const Eventos = () => {
  const colors = tokens();
  const { loading, eventsData, usersEvents } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;
  if (!eventsData) return <div>Falta eventsData() en ParticipantesData().</div>;

  // ===== helpers mínimos =====
  const uniqueNamesForColumn = (colName) => {
    if (!colName) return [];
    const arr = typeof usersEvents === "function" ? usersEvents(colName, "Nombre y apellido") : [];
    return (Array.isArray(arr) ? arr : []).sort((a, b) => a.localeCompare(b, "es"));
  };

  const renderName = (name) => (
    <Typography
      sx={{
        fontWeight: 900,
        fontSize: "13.5px",
        color: colors.primary[100],
      }}
    >
      {name}
    </Typography>
  );

  const titleSlot = (text) => (
    <Box sx={{ height: 48, display: "flex", alignItems: "center" }}>
      <Typography variant="h4" fontWeight={600} color={colors.primary[100]} sx={{ m: 0 }}>
        {text}
      </Typography>
    </Box>
  );

  const gridSx = {
    display: "grid",
    gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
    gap: "20px",
    mt: 1.5,
  };

  const commonTargetProps = {
    variant: "dash",
    fullWidth: true,
    bgColor: colors.primary[200],
    sx: { minHeight: 84, borderRadius: "18px" },
    maxHeight: 260,
    renderItem: (item) => renderName(item),
    expandedDivider: false,
    expandedPaddingTop: 0,
  };

  // ===== data =====
  const { byEvent } = eventsData();
  const safe = Array.isArray(byEvent) ? byEvent : [];

  // ✅ SIN LANZAMIENTOS
  const webinars = safe.filter((e) => /webinar/i.test(String(e.id)));
  const encuentros = safe.filter((e) => /encuentro/i.test(String(e.id)));
  const reuniones = safe.filter((e) => /^reuni[oó]n/i.test(String(e.id)));
  const talleres = safe.filter((e) => /^taller/i.test(String(e.id)));



// ✅ orden fijo (por id exacto de columna)
const ENCUENTRO_ORDER = [
  "1er Encuentro Atacama",
  "2do Encuentro Osorno",
  "3er Encuentro Magallanes",
];

// ✅ si alguno no está en la lista, queda al final
encuentros.sort((a, b) => {
  const ia = ENCUENTRO_ORDER.indexOf(String(a.id));
  const ib = ENCUENTRO_ORDER.indexOf(String(b.id));
  const ra = ia === -1 ? 999 : ia;
  const rb = ib === -1 ? 999 : ib;
  return ra - rb;
});


  // ordenar reuniones por fecha si tienen dd/mm/yyyy
  reuniones.sort((a, b) => {
    const ma = String(a.id).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    const mb = String(b.id).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    const ta = ma ? new Date(+ma[3], +ma[2] - 1, +ma[1]).getTime() : 0;
    const tb = mb ? new Date(+mb[3], +mb[2] - 1, +mb[1]).getTime() : 0;
    return ta - tb;
  });

  const talleres2025 = talleres
    .filter((e) => /2025/.test(String(e.id)))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  const talleres2024 = talleres
    .filter((e) => /2024/.test(String(e.id)))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  const talleres2023 = talleres
    .filter((e) => /2023/.test(String(e.id)))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  // ===== PRESENTACIONES (3 columnas directas) =====
  const namesPresentaOsorno = uniqueNamesForColumn("Presenta Osorno");
  const namesPresentaMagallanes = uniqueNamesForColumn("Presenta Magallanes");
  const namesNumeroEspecial = uniqueNamesForColumn("Participa Numero Especial");

  return (
    <Box m="20px" pb="100px">
      <Header title="EVENTOS" subtitle="Participación por instancia" />

      {/* ENCUENTROS */}
      <Box mt={4}>
        {titleSlot("Encuentros Nacionales de Formadores de Profesores")}
        <Box sx={gridSx}>
          {encuentros.map((ev) => {
            const colName = String(ev.id);
            const names = uniqueNamesForColumn(colName);

            const meta = ENCUENTRO_META[colName] ?? {};
            const title = meta.title ?? String(ev.label ?? ev.id ?? "").trim();
            const desc = meta.desc ?? "";
            const subtitle = meta.subtitle ?? "";

            return (
              <TargetDesc
                key={colName}
                {...commonTargetProps}
                title={title}
                descriptionTitle={subtitle}
                value={ev.value ?? 0}
                valueLabel="participaciones"
                icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
                description={desc}
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* ✅ PRESENTACIONES */}
      <Box mt={4}>
        {titleSlot("PRESENTACIONES")}
        <Box sx={gridSx}>
          <TargetDesc
            {...commonTargetProps}
            title="Encuentro - Osorno"
            value={namesPresentaOsorno.length}
            valueLabel="personas"
            icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
            description=""
            items={namesPresentaOsorno}
          />

          <TargetDesc
            {...commonTargetProps}
            title="Encuentro - Magallanes"
            value={namesPresentaMagallanes.length}
            valueLabel="personas"
            icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
            description=""
            items={namesPresentaMagallanes}
          />

          <TargetDesc
            {...commonTargetProps}
            title="Número especial"
            value={namesNumeroEspecial.length}
            valueLabel="personas"
            icon={<EventNoteIcon sx={{ color: colors.green[200] }} />}
            description=""
            items={namesNumeroEspecial}
          />
        </Box>
      </Box>

      {/* REUNIONES */}
      <Box mt={4}>
        {titleSlot("REUNIONES")}
        <Box sx={gridSx}>
          {reuniones.map((ev) => {
            const colName = String(ev.id);
            const names = uniqueNamesForColumn(colName);

            const meta = REUNION_META[colName] ?? {};
            const title = meta.title ?? String(ev.label ?? ev.id ?? "").trim();
            const desc = meta.desc ?? "";

            return (
              <TargetDesc
                key={colName}
                {...commonTargetProps}
                title={title}
                value={ev.value ?? 0}
                valueLabel="participaciones"
                icon={<EventNoteIcon sx={{ color: colors.green[200] }} />}
                description={desc}
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* TALLERES 2025 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2025")}
        <Box sx={gridSx}>
          {talleres2025.map((ev) => {
            const colName = String(ev.id);
            const names = uniqueNamesForColumn(colName);

            const meta = TALLER_META[colName] ?? {};
            const title = meta.title ?? String(ev.label ?? ev.id ?? "").trim();
            const desc = meta.desc ?? "";
            const subtitle = meta.subtitle ?? "";

            return (
              <TargetDesc
                key={colName}
                {...commonTargetProps}
                title={title}
                descriptionTitle={subtitle}
                value={ev.value ?? 0}
                valueLabel="participaciones"
                icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
                description={desc}
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* TALLERES 2024 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2024")}
        <Box sx={gridSx}>
          {talleres2024.map((ev) => {
            const colName = String(ev.id);
            const names = uniqueNamesForColumn(colName);

            const meta = TALLER_META[colName] ?? {};
            const title = meta.title ?? String(ev.label ?? ev.id ?? "").trim();
            const desc = meta.desc ?? "";
            const subtitle = meta.subtitle ?? "";

            return (
              <TargetDesc
                key={colName}
                {...commonTargetProps}
                title={title}
                descriptionTitle={subtitle}
                value={ev.value ?? 0}
                valueLabel="participaciones"
                icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
                description={desc}
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* TALLERES 2023 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2023")}
        <Box sx={gridSx}>
          {talleres2023.map((ev) => {
            const colName = String(ev.id);
            const names = uniqueNamesForColumn(colName);

            const meta = TALLER_META[colName] ?? {};
            const title = meta.title ?? String(ev.label ?? ev.id ?? "").trim();
            const desc = meta.desc ?? "";
            const subtitle = meta.subtitle ?? "";

            return (
              <TargetDesc
                key={colName}
                {...commonTargetProps}
                title={title}
                descriptionTitle={subtitle}
                value={ev.value ?? 0}
                valueLabel="participaciones"
                icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
                description={desc}
                items={names}
              />
            );
          })}
        </Box>
      </Box>
      {/* WEBINARS */}
      <Box mt={2}>
        {titleSlot("WEBINARS")}
        <Box sx={gridSx}>
          {webinars.map((ev) => {
            const colName = String(ev.id);
            const names = uniqueNamesForColumn(colName);

            const meta = WEBINAR_META[colName] ?? {};
            const title = meta.title ?? String(ev.label ?? ev.id ?? "").trim();
            const desc = meta.desc ?? "";
            const subtitle = meta.subtitle ?? "";

            return (
              <TargetDesc
                key={colName}
                {...commonTargetProps}
                title={title}
                descriptionTitle={subtitle}
                value={ev.value ?? 0}
                valueLabel="participaciones"
                icon={<VideocamIcon sx={{ color: colors.green[200] }} />}
                description={desc}
                items={names}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Eventos;
