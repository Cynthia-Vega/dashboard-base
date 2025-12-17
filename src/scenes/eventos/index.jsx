import { Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Target from "../../components/Target";
import { ParticipantesData } from "../../data/ParticipantesData";

import CampaignIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups";
import VideocamIcon from "@mui/icons-material/Videocam";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HandymanIcon from "@mui/icons-material/Handyman";

import { ResponsiveLine } from "@nivo/line";

const Eventos = () => {
  const colors = tokens();
  const { loading, eventsData } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;
  if (!eventsData) return <div>Falta eventsData() en ParticipantesData().</div>;

  const { byEvent } = eventsData();
  const safe = Array.isArray(byEvent) ? byEvent : [];

  // ====== EVENTOS: Lanzamientos + Webinars ======
  const lanzamientos = safe.filter((e) => /lanzamiento/i.test(e.id));
  const webinars = safe.filter((e) => /webinar/i.test(e.id));
  const encuentros = safe.filter((e) => /encuentro/i.test(e.id));

  const totalLanzamientos = lanzamientos.reduce((a, x) => a + (x.value ?? 0), 0);
  const totalWebinars = webinars.reduce((a, x) => a + (x.value ?? 0), 0);

  // ✅ ENCUENTROS POR LOCALIDAD
  const encuentrosPorLocalidad = Object.entries(
    encuentros.reduce((acc, e) => {
      const raw = String(e.id);
      let loc = (raw.match(/encuentro\s*(.*)$/i)?.[1] ?? raw).trim();
      loc = loc.split(",")[0].trim();
      loc = loc.replace(/^\-+/, "").trim();
      loc = loc.replace(/^de\s+/i, "").trim();
      if (!loc) loc = raw;

      acc[loc] = (acc[loc] || 0) + (e.value ?? 0);
      return acc;
    }, {})
  )
    .map(([loc, value]) => ({ id: loc, label: loc, value }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // ====== REUNIONES ======
  const reuniones = safe
    .filter((e) => /^reuni[oó]n/i.test(e.id))
    .sort((a, b) => {
      const ma = String(a.id).match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const mb = String(b.id).match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const ta = ma ? new Date(+ma[3], +ma[2] - 1, +ma[1]).getTime() : 0;
      const tb = mb ? new Date(+mb[3], +mb[2] - 1, +mb[1]).getTime() : 0;
      return ta - tb;
    });

  // ====== TALLERES (para targets) ======
  const talleres = safe.filter((e) => /^taller/i.test(e.id));

  const talleres2025 = talleres
    .filter((e) => /2025/.test(e.id))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  const talleres2024 = talleres
    .filter((e) => /2024/.test(e.id))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  const talleres2023 = talleres
    .filter((e) => /2023/.test(e.id))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "es"));

  // ====== 📈 DATA para gráfico de líneas (talleres por año) ======
  // extrae año y número de taller desde el nombre de la columna
  // Ej: "Taller N° 1 2025" o "Taller n°2 2023"
  const parsedTalleres = talleres
    .map((t) => {
      const label = String(t.id);

      const yearMatch = label.match(/(20\d{2})/);
      const numMatch = label.match(/n[°º]?\s*(\d+)/i);

      const year = yearMatch ? yearMatch[1] : null;
      const n = numMatch ? Number(numMatch[1]) : null;

      if (!year || !n) return null;

      return {
        year,
        n,
        value: t.value ?? 0,
      };
    })
    .filter(Boolean);

  // dominio de talleres (1..max) para que todas las líneas tengan los mismos X
  const allNs = Array.from(new Set(parsedTalleres.map((d) => d.n))).sort((a, b) => a - b);

  // mapa rápido: year -> (n -> value)
  const yearMap = {};
  parsedTalleres.forEach((d) => {
    if (!yearMap[d.year]) yearMap[d.year] = {};
    yearMap[d.year][d.n] = d.value;
  });

  const lineData = Object.keys(yearMap)
    .sort() // 2023, 2024, 2025...
    .map((year) => ({
      id: year,
      data: allNs.map((n) => ({
        x: String(n),
        y: yearMap[year][n] ?? 0,
      })),
    }));

  // ====== UI ======
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

  return (
    <Box m="20px" pb="100px">
      <Header title="EVENTOS" subtitle="Participación por instancias" />

      {/* EVENTOS (totales) */}
      {titleSlot("EVENTOS")}
      <Box sx={gridSx}>
        <Target
          variant="dash"
          fullWidth
          title="Lanzamiento Atacama"
          value={totalLanzamientos}
          icon={<CampaignIcon sx={{ color: colors.green[200] }} />}
          bgColor={colors.primary[200]}
          sx={{ minHeight: 84, borderRadius: "18px" }}
        />
        <Target
          variant="dash"
          fullWidth
          title="Webinars"
          value={totalWebinars}
          icon={<VideocamIcon sx={{ color: colors.green[200] }} />}
          bgColor={colors.primary[200]}
          sx={{ minHeight: 84, borderRadius: "18px" }}
        />
      </Box>

      {/* ENCUENTROS POR LOCALIDAD */}
      <Box mt={4}>
        {titleSlot("ENCUENTROS")}
        <Box sx={gridSx}>
          {encuentrosPorLocalidad.map((x) => (
            <Target
              key={x.id}
              variant="dash"
              fullWidth
              title={x.label}
              value={x.value ?? 0}
              icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
            />
          ))}
        </Box>
      </Box>

      {/* REUNIONES */}
      <Box mt={4}>
        {titleSlot("REUNIONES")}
        <Box sx={gridSx}>
          {reuniones.map((r) => (
            <Target
              key={r.id}
              variant="dash"
              fullWidth
              title={r.label ?? r.id}
              value={r.value ?? 0}
              icon={<EventNoteIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
            />
          ))}
        </Box>
      </Box>

      {/* TALLERES 2025 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2025")}
        <Box sx={gridSx}>
          {talleres2025.map((t) => (
            <Target
              key={t.id}
              variant="dash"
              fullWidth
              title={t.label ?? t.id}
              value={t.value ?? 0}
              icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
            />
          ))}
        </Box>
      </Box>
      

      {/* TALLERES 2024 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2024")}
        <Box sx={gridSx}>
          {talleres2024.map((t) => (
            <Target
              key={t.id}
              variant="dash"
              fullWidth
              title={t.label ?? t.id}
              value={t.value ?? 0}
              icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
            />
          ))}
        </Box>
      </Box>

      {/* TALLERES 2023 */}
      <Box mt={4}>
        {titleSlot("TALLERES 2023")}
        <Box sx={gridSx}>
          {talleres2023.map((t) => (
            <Target
              key={t.id}
              variant="dash"
              fullWidth
              title={t.label ?? t.id}
              value={t.value ?? 0}
              icon={<HandymanIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
            />
          ))}
        </Box>
      </Box>

      {/* 📈 EVOLUCIÓN TALLERES */}
      <Box mt={4}>
        {titleSlot("EVOLUCIÓN DE TALLERES (POR AÑO)")}

        <Box
          sx={{
            height: 380,
            mt: 1.5,
            p: 2,
            borderRadius: "18px",
            border: "1px solid rgba(0,0,0,0.10)",
            backgroundColor: colors.primary[200],
          }}
        >
          {lineData.length === 0 ? (
            <Typography color={colors.primary[100]}>
              No hay datos suficientes para graficar talleres (revisar nombres: año y N°).
            </Typography>
          ) : (
            <ResponsiveLine
              data={lineData}
              margin={{ top: 20, right: 30, bottom: 55, left: 55 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
              axisBottom={{
                legend: "Taller (N°)",
                legendOffset: 40,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Cantidad",
                legendOffset: -45,
                legendPosition: "middle",
              }}
              pointSize={8}
              pointBorderWidth={1}
              useMesh={true}
              theme={{
                axis: {
                  ticks: { text: { fill: colors.primary[100] }, line: { stroke: "rgba(0,0,0,0.25)" } },
                  legend: { text: { fill: colors.primary[100] } },
                  domain: { line: { stroke: "rgba(0,0,0,0.25)" } },
                },
                legends: { text: { fill: colors.primary[100] } },
                tooltip: { container: { color: colors.primary[100] } },
              }}
              legends={[
                {
                  anchor: "top-left",
                  direction: "row",
                  translateY: -10,
                  itemWidth: 70,
                  itemHeight: 18,
                  symbolSize: 10,
                },
              ]}
            />
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default Eventos;
