import { Box, Button, Typography } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";


import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import ProgressCircle from "../../components/ProgressCircle";
import TargetMin from "../../components/targets/TargetMin";

import { ParticipantesData } from "../../data/ParticipantesData";

import { Link as RouterLink } from "react-router-dom";


const Dashboard = () => {
  const colors = tokens();
  const { loading, frecuencyData, cumulativeFrequencyData, universityImage, programsCategoryCounts } =
  ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;


  const totalPorRegion = frecuencyData("region_id");
 
  const totalPoranio = cumulativeFrequencyData("Año RedFID");
  const experience = frecuencyData("experience");
  const carrera = frecuencyData("Título");
  const universidades = frecuencyData("nombre_universidad");
  const grado = frecuencyData("grado_final");
  const programas = programsCategoryCounts();

  const Clickable = ({ to, children, sx }) => (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        width: "100%",
        cursor: "pointer",
        transition: "transform 120ms ease",
        "&:hover": { transform: "translateY(-1px)" },
        ...sx,
      }}
    >
      {children}
    </Box>
  );

  const ROUTES = {
    participantes: "/participantes",
    formacion_niveles: "/formacion",
    formacion_grado: "/formacion",
    formacion_titulo: "/formacion",
    formacion_programas: "/formacion",
    universidades: "/universidades",
    region: "/regiones",
  };


  return (
    <Box m="20px">
      {/* HEADER */}
      <Header title="Panel de datos" subtitle="Resumen general de formadores" />

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
          Descargar Reporte
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
          gridTemplateRows="48px 1fr" 
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

         
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ mt: 0 }}
          >
            <Clickable to={ROUTES.participantes}>
            <TargetMin
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
                pt: 3,
              }}
            />
            </Clickable>
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
            <Clickable to={ROUTES.formacion_niveles}>
            <TargetMin
              icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
              value={experience.find((c) => c.id === "novel")?.value || 0}
              title="Novel"
              titlePosition="bottom"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* INTERMEDIO */}
            <Clickable to={ROUTES.formacion_niveles}>
            <TargetMin
              icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
              value={experience.find((c) => c.id === "intermedio")?.value || 0}
              title="Intermedio"
              titlePosition="bottom"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* EXPERTO */}
            <Clickable to={ROUTES.formacion_niveles}>
            <TargetMin
              icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
              value={experience.find((c) => c.id === "experto")?.value || 0}
              title="Experto"
              titlePosition="bottom"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

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
            <Clickable to={ROUTES.formacion_grado}>
            <TargetMin
              icon={<HistoryEduIcon sx={{ color: colors.green[200] }} />}
              value={grado.find((c) => c.id === "Licenciatura")?.value || 0}
              title="Licenciatura"
              titlePosition="bottom"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* MAGÍSTER */}
            <Clickable to={ROUTES.formacion_grado}>
            <TargetMin
              icon={<HistoryEduIcon sx={{ color: colors.green[200] }} />}
              value={grado.find((c) => c.id === "Magíster")?.value || 0}
              title="Magíster"
              titlePosition="bottom"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* DOCTORADO */}
            <Clickable to={ROUTES.formacion_grado}>
            <TargetMin
              icon={<HistoryEduIcon sx={{ color: colors.green[200] }} />}
              value={grado.find((c) => c.id === "Doctorado")?.value || 0}
              title="Doctorado"
              titlePosition="bottom"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

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
            <Clickable to={ROUTES.formacion_titulo}>
            <TargetMin
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Educador/a de Párvulos")?.value || 0}
              title="Educador/a de Párvulos"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* Profesor/a de Educación Básica */}
            <Clickable to={ROUTES.formacion_titulo}>
            <TargetMin
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Profesor/a de Educación Básica")?.value || 0}
              title="Profesor/a de Educación Básica"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* Profesor/a de Educación Media */}
            <Clickable to={ROUTES.formacion_titulo}>
            <TargetMin
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Profesor/a de Educación Media")?.value || 0}
              title="Profesor/a de Educación Media"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

            {/* Otro */}
            <Clickable to={ROUTES.formacion_titulo}>
            <TargetMin
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Otro")?.value || 0}
              title="Otro"
              duration={1500}
              fullWidth
              variant="dash"
            />
            </Clickable>

          </Box>

          {/* ---------- PROGRAMAS DONDE IMPARTEN ---------- */}
          <Box mt={2.5}>
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.primary[100]}
              sx={{ mb: 2 }}
            >
              PROGRAMAS DONDE IMPARTEN
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)", // ✅ 6 categorías -> 3x2 en desktop
              }}
              gap="20px"
              alignItems="stretch"
            >
          {programas.map((p) => {
            const icon =
              p.id === "media" ? <SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} /> :
              p.id === "basica" ? <MenuBookIcon sx={{ color: colors.green[200], fontSize: 55 }} /> :
              p.id === "parvularia" ? <ChildCareIcon sx={{ color: colors.green[200], fontSize: 55 }} /> :
              p.id === "postgrado" ? <WorkspacePremiumIcon sx={{ color: colors.green[200], fontSize: 55 }} /> :
              p.id === "otras_carreras" ? <MiscellaneousServicesIcon sx={{ color: colors.green[200], fontSize: 55 }} /> :
              <PsychologyIcon sx={{ color: colors.green[200], fontSize: 55 }} />;

            return (
              <Clickable to={ROUTES.formacion_programas}>
              <TargetMin
                key={p.id}
                icon={icon}
                value={p.value ?? 0}
                title={p.label}
                duration={1500}
                fullWidth
                variant="dash"
                valueLabel="personas"
              />
              </Clickable>
            );
          })}

            </Box>
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
  {universidades.map((uni, i) => {
    const name = uni.label || uni.id || "Universidad";
    const imgSrc = universityImage(name);

    return (
      <Clickable to={ROUTES.universidades}>
      <Box
        key={`${uni.id}-${i}`}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[200]}`}
        p="16px"
        gap="12px"
      >
        {/* IZQUIERDA: logo + nombre */}
        <Box display="flex" alignItems="center" gap="10px" minWidth={0}>
          {imgSrc ? (
            <Box
              component="img"
              src={imgSrc}
              alt={name}
              sx={{
                width: 26,
                height: 26,
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          ) : (
            // fallback: circulito si no hay logo
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: colors.primary[300],
                flexShrink: 0,
              }}
            />
          )}

          <Typography
            color={colors.green[200]}
            variant="h5"
            fontWeight="600"
            noWrap
            sx={{ minWidth: 0 }}
            title={name}
          >
            {name}
          </Typography>
        </Box>

        {/* DERECHA: conteo */}
        <Box
          backgroundColor={colors.green[200]}
          p="6px 20px"
          borderRadius="4px"
          whiteSpace="nowrap"
          flexShrink={0}
        >
          {uni.value} personas
        </Box>
      </Box>
      </Clickable>
    );
  })}
</Box>

        </Box>

        {/* ==========================
            ROW 5 - DONUT MAPA
           ========================== */}

        {/* Card: Regiones abarcadas */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4", lg:"span 3"}}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
          sx={{ minWidth: 0, textAlign: "center"}}
        >
          <Typography variant="h4" fontWeight="600" color={colors.primary[100]}>
            Regiones abarcadas
          </Typography>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"          // ✅ centra el donut
          justifyContent="flex-start"
          height="100%"
          sx={{
            pt: 5,                   // ajusta si lo quieres más arriba/abajo
            gap: 2,
          }}
        >

          <Clickable
            to={ROUTES.region}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 125,
                height: 125,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProgressCircle size={150} data={totalPorRegion} />
            </Box>
          </Clickable>


            {/* Total centrado debajo */}
            <Typography variant="h5" color={colors.primary[100]} sx={{ textAlign: "center" }}>
              Total regiones: {totalPorRegion?.length || 0}
            </Typography>
          </Box>

        </Box>


        {/* Card: Distribución por región */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 8", lg:"span 9" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
          display="flex"
          flexDirection="column"
          sx={{ minWidth: 0 }}
        >
          <Typography variant="h4" fontWeight="600" color={colors.primary[100]}>
            Distribución por región
          </Typography>

          <Box
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            // border="1px solid red"
            sx={{

      overflowX: { xs: "auto", sm: "auto", md: "hidden" },
      overflowY: "hidden",
      minWidth: 0,
    }}
          >
            <Clickable to={ROUTES.region}>
            <Box
      sx={{
        width:  { xs: 520, sm: 650, md: 820, lg: 950 },
        height: { xs: 220, sm: 240, md: 260, lg: 280 },
        position: "relative",
        mx: "auto",
      }}
    >
           
              <GeographyChart isDashboard={true} data={totalPorRegion} />
            </Box>
            </Clickable>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
