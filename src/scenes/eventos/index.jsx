import { Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { ParticipantesData } from "../../data/ParticipantesData";

// ✅ nuevos targets separados
import TargetMin from "../../components/targets/TargetMin";
import TargetList from "../../components/targets/TargetList";
import TargetDesc from "../../components/targets/TargetDesc";

import CampaignIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups";
import VideocamIcon from "@mui/icons-material/Videocam";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HandymanIcon from "@mui/icons-material/Handyman";

const Eventos = () => {
  const colors = tokens();
  const { loading, eventsData, rawData } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;
  if (!eventsData) return <div>Falta eventsData() en ParticipantesData().</div>;

  const safeRaw = Array.isArray(rawData) ? rawData : [];

  // ===== helpers =====
  const normKey = (v) =>
    String(v ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isMarked = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
    if (typeof v === "boolean") return v;
    const s = String(v).trim().toLowerCase();
    if (!s) return false;
    return ["1", "x", "si", "sí", "true", "ok", "✔"].includes(s);
  };

  const uniqueNamesForColumn = (colName) => {
    if (!colName) return [];
    const set = new Set();

    safeRaw.forEach((r) => {
      if (!isMarked(r?.[colName])) return;

      const name = String(r?.["Indique su nombre y apellido"] ?? "").trim();
      if (!name) return;

      set.add(name);
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  };

  // Encuentro por localidad: juntamos participantes de TODAS las columnas "encuentro" que contengan esa localidad
  const uniqueNamesForEncuentroLoc = (locLabel) => {
    const loc = normKey(locLabel);
    if (!loc) return [];

    const cols = safe
      .filter((e) => /encuentro/i.test(String(e.id)))
      .map((e) => String(e.id));

    const matchedCols = cols.filter((c) => normKey(c).includes(loc));
    const set = new Set();

    matchedCols.forEach((c) => {
      uniqueNamesForColumn(c).forEach((n) => set.add(n));
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
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

  // ===== data base =====
  const { byEvent } = eventsData();
  const safe = Array.isArray(byEvent) ? byEvent : [];

  const lanzamientos = safe.filter((e) => /lanzamiento/i.test(String(e.id)));
  const webinars = safe.filter((e) => /webinar/i.test(String(e.id)));
  const encuentros = safe.filter((e) => /encuentro/i.test(String(e.id)));

  const totalLanzamientos = lanzamientos.reduce((a, x) => a + (x.value ?? 0), 0);
  const totalWebinars = webinars.reduce((a, x) => a + (x.value ?? 0), 0);

  // ✅ ENCUENTROS POR LOCALIDAD
  const encuentrosPorLocalidad = Object.entries(
    encuentros.reduce((acc, e) => {
      const raw = String(e.id);

      // toma lo que viene después de "encuentro ..."
      let loc = (raw.match(/encuentro\s*(.*)$/i)?.[1] ?? raw).trim();

      // corta por coma
      loc = loc.split(",")[0].trim();

      // limpia guiones y "de ..."
      loc = loc.replace(/^\-+/, "").trim();
      loc = loc.replace(/^de\s+/i, "").trim();

      if (!loc) loc = raw;

      acc[loc] = (acc[loc] || 0) + (e.value ?? 0);
      return acc;
    }, {})
  )
    .map(([loc, value]) => ({ id: loc, label: loc, value }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // ===== REUNIONES =====
  const reuniones = safe
    .filter((e) => /^reuni[oó]n/i.test(String(e.id)))
    .sort((a, b) => {
      const ma = String(a.id).match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const mb = String(b.id).match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const ta = ma ? new Date(+ma[3], +ma[2] - 1, +ma[1]).getTime() : 0;
      const tb = mb ? new Date(+mb[3], +mb[2] - 1, +mb[1]).getTime() : 0;
      return ta - tb;
    });

  // ===== TALLERES =====
  const talleres = safe.filter((e) => /^taller/i.test(String(e.id)));

  const talleres2025 = talleres
    .filter((e) => /2025/.test(String(e.id)))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  const talleres2024 = talleres
    .filter((e) => /2024/.test(String(e.id)))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  const talleres2023 = talleres
    .filter((e) => /2023/.test(String(e.id)))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  // ===== UI =====
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

  // ✅ descripción ejemplo (solo Osorno)
  const encuentroDescByLoc = {
    osorno:
      "Tercer encuentro nacional de formadores en Matemática RedFID: Innovar en Comunidad: Construyendo Redes para Transformar",
  };

  const EncuentrosGrid = () => (
    <Box sx={gridSx}>
      {encuentrosPorLocalidad.map((x) => {
        const loc = x.label;
        const names = uniqueNamesForEncuentroLoc(loc);
        const desc = encuentroDescByLoc[normKey(loc)] ?? "";

        // 👉 con descripción => TargetDesc
        if (desc) {
          return (
            <TargetDesc
              key={x.id}
              variant="dash"
              fullWidth
              title={loc}
              value={x.value ?? 0}
              valueLabel="participantes"
              icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
              description={desc}
              items={names}
              maxHeight={260}
              renderItem={(item) => renderName(item)}
              expandedDivider={false}      // ✅ evita línea doble (ya hay líneas en la descripción)
              expandedPaddingTop={0}       // ✅ pegadito como en tu diseño
            />
          );
        }

        // 👉 sin descripción => TargetList
        return (
          <TargetList
            key={x.id}
            variant="dash"
            fullWidth
            title={loc}
            value={x.value ?? 0}
            valueLabel="participantes"
            icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
            bgColor={colors.primary[200]}
            sx={{ minHeight: 84, borderRadius: "18px" }}
            items={names}
            maxHeight={260}
            renderItem={(item) => renderName(item)}
            expandedDivider
            expandedPaddingTop={12}
          />
        );
      })}
    </Box>
  );

  const TalleresGrid = ({ data }) => (
    <Box sx={gridSx}>
      {data.map((t) => {
        const colName = String(t.id);
        const names = uniqueNamesForColumn(colName);

        return (
          <TargetList
            key={t.id}
            variant="dash"
            fullWidth
            title={t.label ?? t.id}
            value={t.value ?? 0}
            valueLabel="participantes"
            icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
            bgColor={colors.primary[200]}
            sx={{ minHeight: 84, borderRadius: "18px" }}
            items={names}
            maxHeight={260}
            renderItem={(item) => renderName(item)}
            expandedDivider
            expandedPaddingTop={12}
          />
        );
      })}
    </Box>
  );

  return (
    <Box m="20px" pb="100px">
      <Header title="EVENTOS" subtitle="Participación por instancias" />

      {/* EVENTOS (totales) */}
      {titleSlot("EVENTOS")}
      <Box sx={gridSx}>
        <TargetMin
          variant="dash"
          fullWidth
          title="Lanzamiento Atacama"
          value={totalLanzamientos}
          valueLabel="participaciones"
          icon={<CampaignIcon sx={{ color: colors.green[200] }} />}
          bgColor={colors.primary[200]}
          sx={{ minHeight: 84, borderRadius: "18px" }}
        />
        <TargetMin
          variant="dash"
          fullWidth
          title="Webinars"
          value={totalWebinars}
          valueLabel="participaciones"
          icon={<VideocamIcon sx={{ color: colors.green[200] }} />}
          bgColor={colors.primary[200]}
          sx={{ minHeight: 84, borderRadius: "18px" }}
        />
      </Box>

      {/* ENCUENTROS */}
      <Box mt={4}>
        {titleSlot("ENCUENTROS")}
        <EncuentrosGrid />
      </Box>

      {/* REUNIONES */}
      <Box mt={4}>
        {titleSlot("REUNIONES")}
        <Box sx={gridSx}>
          {reuniones.map((r) => {
            const colName = String(r.id);
            const names = uniqueNamesForColumn(colName);

            return (
              <TargetList
                key={r.id}
                variant="dash"
                fullWidth
                title={r.label ?? r.id}
                value={r.value ?? 0}
                valueLabel="participantes"
                icon={<EventNoteIcon sx={{ color: colors.green[200] }} />}
                bgColor={colors.primary[200]}
                sx={{ minHeight: 84, borderRadius: "18px" }}
                items={names}
                maxHeight={260}
                renderItem={(item) => renderName(item)}
                expandedDivider
                expandedPaddingTop={12}
              />
            );
          })}
        </Box>
      </Box>

      {/* TALLERES 2025 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2025")}
        <TalleresGrid data={talleres2025} />
      </Box>

      {/* TALLERES 2024 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2024")}
        <TalleresGrid data={talleres2024} />
      </Box>

      {/* TALLERES 2023 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2023")}
        <TalleresGrid data={talleres2023} />
      </Box>
    </Box>
  );
};

export default Eventos;
