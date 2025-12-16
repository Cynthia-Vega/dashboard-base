import { Box, Button, Typography } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";

import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import ProgressCircle from "../../components/ProgressCircle";
import Target from "../../components/Target";

import { ParticipantesData } from "../../data/ParticipantesData";

const Dashboard = () => {
  const colors = tokens();
  const sectionTitleSx = {
  m: 0,
  lineHeight: "48px",
  fontWeight: 600,
  color: colors.primary[100],
};
  const { loading, frecuencyData, cumulativeFrequencyData, experienceLevelsData } =
    ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;

  const totalPorGenero = frecuencyData("Género");
  const totalPorRegion = frecuencyData("region_id");
  const totalPorUniversidad = frecuencyData("Universidad");
  const totalPoranio = cumulativeFrequencyData("¿En qué año te uniste a RedFID? ");
  const experience = experienceLevelsData("Años de formador ");
  const carrera = frecuencyData("Indique su título profesional");
  const universidades = frecuencyData("nombre_universidad");
  const grado = frecuencyData("grado_final");

  console.log("data U", universidades)

  return (
    <Box m="20px">
      {/* HEADER */}
      <Header title="DASHBOARD" subtitle="Resumen general de formadores" />

      <Box mt={0} mb={0.1} display="flex" justifyContent="flex-start">
        <Button
          onClick={() => alert("Próximamente!")}
          sx={{
            backgroundColor: colors.green[100],
            color: colors.primary[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(180px, auto)"
        gap="20px"
      >
        {/* ==========================
            BLOQUE FORMADORES + NIVELES + GRADO
           ========================== */}

        {/* FORMADORES: ocupa 2 filas */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 4", lg: "span 3" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
  p="20px"
  pt={4}
  display="grid"
  gridTemplateRows="48px 1fr"   // ✅ 48px reservados para el título
  gap={0}
  sx={{ minWidth: 0 }}
>
          <Typography
            variant="h3"
            fontWeight="600"
            color={colors.primary[100]}
            sx={{ mb: 2 }}
          >
            FORMADORES
          </Typography>

          {/* 👇 clave: no wrapper con maxWidth fijo (evita overlap) */}
          <Box
  width="100%"
  display="flex"
  justifyContent="flex-start"
  alignItems="flex-start"
  sx={{ mt: 0 }}   // por si se te coló margen
>
            <Target
              icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
              value={totalPoranio.find((c) => c.id === "2025")?.value || 0}
              title="Total"
              titlePosition="bottom"
              duration={1500}
              orientation="vertical"
              variant="hero"
              fullWidth
              sx={{
                width: "100%",
                maxWidth: "100%",
                minHeight: { xs: 240, md: 260, lg: 280 },
                pt : 3
              }}
            />
          </Box>
        </Box>

        {/* DERECHA: NIVELES + GRADO */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 8", lg: "span 9" }}
          gridRow="span 2"
          display="flex"
          flexDirection="column"
          gap={4}
          justifyContent="flex-start"
          pt={2.9}
          sx={{ minWidth: 0 }}
        >
          {/* BLOQUE NIVELES */}
          <Box>
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.primary[100]}
              sx={{ m: 0, lineHeight: "48px" }}   // ✅ mismo alto reservado
            >
              NIVELES
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap="20px"
              alignItems="stretch"
              
            >
              {/* NOVEL */}
              <Target
                icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
                value={experience.find((c) => c.id === "novel")?.value || 0}
                title="Novel"
                titlePosition="bottom"
                duration={1500}
                fullWidth
                variant="dash"
              />

              {/* INTERMEDIO */}
              <Target
                icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
                value={experience.find((c) => c.id === "intermedio")?.value || 0}
                title="Intermedio"
                titlePosition="bottom"
                duration={1500}
                fullWidth
                variant="dash"
              />

              {/* EXPERTO */}
              <Target
                icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
                value={experience.find((c) => c.id === "experto")?.value || 0}
                title="Experto"
                titlePosition="bottom"
                duration={1500}
                fullWidth
                variant="dash"
              />
            </Box>
          </Box>

          {/* BLOQUE GRADO */}
          <Box>
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.primary[100]}
              sx={{ mb: 2 }}
            >
              GRADO
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap="20px"
              alignItems="stretch"
            >
              {/* LICENCIATURA */}
              <Target
                icon={<HistoryEduIcon sx={{ color: colors.green[200] }} />}
                value={grado.find((c) => c.id === "Licenciatura")?.value || 0}
                title="Licenciatura"
                titlePosition="bottom"
                duration={1500}
                fullWidth
                variant="dash"
              />

              {/* MAGÍSTER */}
              <Target
                icon={<HistoryEduIcon sx={{ color: colors.green[200] }} />}
                value={grado.find((c) => c.id === "Magíster")?.value || 0}
                title="Magíster"
                titlePosition="bottom"
                duration={1500}
                fullWidth
                variant="dash"
              />

              {/* DOCTORADO */}
              <Target
                icon={<HistoryEduIcon sx={{ color: colors.green[200] }} />}
                value={grado.find((c) => c.id === "Doctorado")?.value || 0}
                title="Doctorado"
                titlePosition="bottom"
                duration={1500}
                fullWidth
                variant="dash"
              />
            </Box>
          </Box>
        </Box>

        {/* ==========================
            TÍTULO PROFESIONAL
           ========================== */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 12" }}
          gridRow="span 1"
          backgroundColor={colors.primary[200]}
          p="20px"
          pt={0}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ minWidth: 0 }}
        >
          <Typography variant="h4" fontWeight="600" color={colors.primary[100]}>
            TÍTULO PROFESIONAL
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap="20px"
            alignItems="stretch"
          >
            {/* Educador/a de Párvulos */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Educador/a de Párvulos")?.value || 0}
              title="Educador/a de Párvulos"
              duration={1500}
              fullWidth
              variant="dash"
            />

            {/* Profesor/a Educación Básica */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={
                carrera.find((c) => c.id === "Profesor/a de Educación Básica")?.value || 0
              }
              title="Profesor/a de Educación Básica"
              duration={1500}
              fullWidth
              variant="dash"
            />

            {/* Profesor/a Educación Media */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={
                carrera.find((c) => c.id === "Profesor/a de Educación Media")?.value || 0
              }
              title="Profesor/a de Educación Media"
              duration={1500}
              fullWidth
              variant="dash"
            />

            {/* Otro */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Otro")?.value || 0}
              title="Otro"
              duration={1500}
              fullWidth
              variant="dash"
            />
          </Box>
        </Box>

        {/* ==========================
            ROW 4 - TRAYECTORIA Y UNIVERSIDADES
           ========================== */}

        {/* CARD IZQUIERDA: TRAYECTORIA */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 7" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          display="flex"
          flexDirection="column"
          height="350px"
          sx={{ minWidth: 0 }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[200]}`}
            p="15px"
          >
            <Typography variant="h4" fontWeight="600" color={colors.primary[100]}>
              TRAYECTORIA RedFID
            </Typography>
          </Box>

          <Box flex="1" overflow="hidden" p="10px 15px">
            <Box height="260px">
              <LineChart data={totalPoranio} isDashboard={true} />
            </Box>
          </Box>
        </Box>

        {/* CARD DERECHA: UNIVERSIDADES */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 5" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          display="flex"
          flexDirection="column"
          height="350px"
          sx={{ minWidth: 0 }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[200]}`}
            p="15px"
          >
            <Typography variant="h4" fontWeight="600" color={colors.primary[100]}>
              UNIVERSIDADES
            </Typography>
          </Box>

          {/* Lista con scroll */}
          <Box flex="1" overflow="auto" p="15px">
            {universidades.map((uni, i) => (
              <Box
                key={`${uni.id}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[200]}`}
                p="16px"
              >
                <Typography color={colors.green[200]} variant="h5" fontWeight="600">
                  {uni.id}
                </Typography>

                <Box
                  backgroundColor={colors.green[200]}
                  p="6px 20px"
                  borderRadius="4px"
                  whiteSpace="nowrap"
                >
                  {uni.value} personas
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ==========================
            ROW 5 - DONUT MAPA
           ========================== */}

        {/* Card: Regiones abarcadas */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
          sx={{ minWidth: 0 }}
        >
          <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
            Regiones abarcadas
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            gap={2}
          >
            <ProgressCircle size={125} data={totalPorRegion} />
            <Typography variant="h5" color={colors.primary[100]}>
              Total regiones: {totalPorRegion?.length || 0}
            </Typography>
          </Box>
        </Box>

        {/* Card: Distribución por región */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 8" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
          display="flex"
          flexDirection="column"
          sx={{ minWidth: 0 }}
        >
          <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
            Distribución por región
          </Typography>

          <Box
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Box
              height="260px"
              width="650px"
              position="relative"
              sx={{
                maxWidth: "100%",
                width: { xs: "100%", md: "650px" },
              }}
            >
              <GeographyChart isDashboard={true} data={totalPorRegion} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
