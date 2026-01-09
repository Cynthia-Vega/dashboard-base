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
import TargetMin from "../../components/targets/TargetMin";

import { ParticipantesData } from "../../utils/ParticipantesData";
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

  const ROUTES = {
    participantes: "/participantes",
    formacion_niveles: "/formacion",
    formacion_grado: "/formacion",
    formacion_titulo: "/formacion",
    formacion_programas: "/formacion",
    universidades: "/universidades",
    region: "/regiones",
  };

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

  return (
    <Box m="20px" ml="5px" sx={{ minHeight: "100vh" }} pb="100px">
      <Header title="Panel de datos" subtitle="Resumen general de formadores" />

      <Box display="flex" justifyContent="flex-start" >
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
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
          gap: { xs: "10px", sm: "12px", md: "20px" }, 
          alignItems: "start",
        }}
      >
        {/* ==========================
            COLUMNA IZQUIERDA
           ========================== */}
        <Box
          sx={{
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",

            gridAutoRows: "auto",

            gap: { xs: "10px", sm: "12px", md: "20px" }, 
            alignContent: "start",
          }}
        >
          {/* ==========================
            FORMADORES | NIVELES | GRADO
           ========================== */}

          {/* FORMADORES */}
          <Box
            sx={{
              gridColumn: { xs: "span 12", md: "span 4" },
              gridRow: "span 2",
              backgroundColor: colors.primary[200],
              pt: "15px",
              pr: "15px",
              pl: "0px",
              pb: "15px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 1.5, }}>
              <Typography
                variant="h3"
                fontWeight={700}
                color={colors.primary[100]}
                sx={{ lineHeight: 1, m: 0, fontFamily: "inherit" }}
              >
                FORMADORES
              </Typography>
            </Box>

            <Box flex="1" display="flex" alignItems="flex-start">
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
                    minHeight: { xs: 220, sm: 230, md: 260, lg: 280 }, 
                  }}
                />
              </Clickable>
            </Box>
          </Box>

          {/* NIVELES */}
          <Box
            sx={{
              gridColumn: { xs: "span 12", md: "span 4" },
              gridRow: "span 2",
              backgroundColor: colors.primary[200],
              pt: "15px",
              pr: "15px",
              pl: "0px",
              pb: "15px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                color={colors.primary[100]}
                sx={{ lineHeight: 1, m: 0, fontFamily: "inherit" }}
              >
                NIVELES
              </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={{ xs: "10px", md: "14px" }}>
              <Clickable to={ROUTES.formacion_niveles}>
                <TargetMin
                  icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
                  value={experience.find((c) => c.id === "Novel")?.value || 0}
                  title="Novel"
                  titlePosition="bottom"
                  duration={1500}
                  fullWidth
                  variant="dash"
                />
              </Clickable>

              <Clickable to={ROUTES.formacion_niveles}>
                <TargetMin
                  icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
                  value={experience.find((c) => c.id === "Intermedio")?.value || 0}
                  title="Intermedio"
                  titlePosition="bottom"
                  duration={1500}
                  fullWidth
                  variant="dash"
                />
              </Clickable>

              <Clickable to={ROUTES.formacion_niveles}>
                <TargetMin
                  icon={<PsychologyIcon sx={{ color: colors.green[200] }} />}
                  value={experience.find((c) => c.id === "Experto")?.value || 0}
                  title="Experto"
                  titlePosition="bottom"
                  duration={1500}
                  fullWidth
                  variant="dash"
                />
              </Clickable>
            </Box>
          </Box>

          {/* GRADO */}
          <Box
            sx={{
              gridColumn: { xs: "span 12", md: "span 4" },
              gridRow: "span 2",
              backgroundColor: colors.primary[200],
              pt: "15px",
              pr: "15px",
              pl: "0px",
              pb: "15px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                color={colors.primary[100]}
                sx={{ lineHeight: 1, m: 0, fontFamily: "inherit" }}
              >
                GRADO ACADÉMICO
              </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={{ xs: "10px", md: "14px" }}>
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

          {/* ==========================
              TÍTULO PROFESIONAL + PROGRAMAS
           ========================== */}
          <Box
            sx={{
              gridColumn: "span 12",
              backgroundColor: colors.primary[200],
              pt: "15px",
              pr: "15px",
              pl: "0px",
              pb: "15px",
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.2, md: 1.5 }, 
              minWidth: 0,
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center" }}>
              <Typography variant="h4" fontWeight={600} color={colors.primary[100]} sx={{ m: 0, fontFamily: "inherit" }}>
                TÍTULO PROFESIONAL
              </Typography>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              }}
              gap={{ xs: "10px", md: "20px" }}
            >
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

            <Box mt={{ xs: 1.2, md: 2 }}>
              <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 0.5 }}>
                <Typography variant="h4" fontWeight={600} color={colors.primary[100]} sx={{ m: 0, fontFamily: "inherit" }}>
                  PROGRAMAS DONDE IMPARTEN
                </Typography>
              </Box>

              <Box
                display="grid"
                gridTemplateColumns={{ xs: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
                gap={{ xs: "10px", md: "20px" }}
              >
                {programas.map((p) => {
                  const icon =
                    p.id === "educacion_media" ? (
                      <SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />
                    ) : p.id === "educacion_basica" ? (
                      <MenuBookIcon sx={{ color: colors.green[200], fontSize: 55 }} />
                    ) : p.id === "educacion_parvularia" ? (
                      <ChildCareIcon sx={{ color: colors.green[200], fontSize: 55 }} />
                    ) : p.id === "postgrado" ? (
                      <WorkspacePremiumIcon sx={{ color: colors.green[200], fontSize: 55 }} />
                    ) : p.id === "otras_carreras" ? (
                      <MiscellaneousServicesIcon sx={{ color: colors.green[200], fontSize: 55 }} />
                    ) : (
                      <PsychologyIcon sx={{ color: colors.green[200], fontSize: 55 }} />
                    );

                  return (
                    <Clickable key={p.id} to={ROUTES.formacion_programas}>
                      <TargetMin
                        icon={icon}
                        value={p.value ?? 0}
                        title={p.label}
                        duration={1500}
                        fullWidth
                        variant="dash"
                        valueLabel="personas"
                        sx={{ height: "100%" }}
                      />
                    </Clickable>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* ==========================
              TRAYECTORIA + UNIVERSIDADES
           ========================== */}
          <Box
            sx={{
              gridColumn: { xs: "span 12", md: "span 7" },
              gridRow: "span 2",
              backgroundColor: colors.primary[200],
              pt: "15px",
              pr: "15px",
              pl: "0px",
              pb: "15px",
              display: "flex",
              flexDirection: "column",
              height: { xs: 320, md: 350 },
              minWidth: 0,
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                color={colors.primary[100]}
                sx={{ lineHeight: 1, m: 0, fontFamily: "inherit" }}
              >
                CRECIMIENTO RedFID
              </Typography>
            </Box>

            <Box flex="1" minHeight={0} overflow="hidden">
              <Box sx={{ height: { xs: 230, md: 260 } }}>
                <LineChart data={totalPoranio} isDashboard={true} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "span 12", md: "span 5" },
              gridRow: "span 2",
              backgroundColor: colors.primary[200],
              pt: "15px",
              pr: "15px",
              pl: "0px",
              pb: "15px",
              display: "flex",
              flexDirection: "column",
              height: { xs: 320, md: 350 },
              minWidth: 0,
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                color={colors.primary[100]}
                sx={{ lineHeight: 1, m: 0, fontFamily: "inherit" }}
              >
                UNIVERSIDADES
              </Typography>
            </Box>

            <Box flex="1" minHeight={0} overflow="auto">
              {universidades.map((uni, i) => {
                const name = uni.label || uni.id || "Universidad";
                const imgSrc = universityImage(name);

                return (
                  <Clickable key={`${uni.id}-${i}`} to={ROUTES.universidades}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom={`4px solid ${colors.primary[200]}`}
                      p="12px"
                      pl="0px"
                      gap="12px"
                    >
                      <Box display="flex" alignItems="center" gap="10px" minWidth={0}>
                        {imgSrc ? (
                          <Box
                            component="img"
                            src={imgSrc}
                            alt={name}
                            sx={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }}
                          />
                        ) : (
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
                          sx={{ minWidth: 0, fontFamily: "inherit" }}
                          title={name}
                        >
                          {name}
                        </Typography>
                      </Box>

                      <Box
                        backgroundColor={colors.green[200]}
                        p="6px 16px"
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
        </Box>

        {/* ==========================
            COLUMNA DERECHA (MAPA)
           ========================== */}
        <Box
          sx={{
            minWidth: 0,
            width: { xs: "100%", lg: 360 },
            display: "flex",
            alignSelf: "start",
          }}
        >
          <Box
            backgroundColor={colors.primary[200]}
              pt= "15px"
              pr= "15px"
              pl= "0px"
              pb= "15px"
            display="flex"
            flexDirection="column"
            sx={{
              width: "100%",
              overflow: "hidden",


              height: { xs: 1160, sm: 1160, md: 1160, lg: 1160 },
              minHeight: { xs: 980, sm: 980, md: 980, lg: 1160 },
            }}
          >
            <Box sx={{ height: 42, display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography
                variant="h4"
                fontWeight={600}
                color={colors.primary[100]}
                sx={{ lineHeight: 1, m: 0, fontFamily: "inherit" }}
              >
                REGIÓN
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: 300, 
                  height: "100%", 
                  flexShrink: 0,
                  overflow: "hidden",
                  
                  // border: "1px solid red",
                }}
              >
                <Clickable to={ROUTES.region} sx={{ width: "100%", height: "100%" }}>
                  <Box sx={{ width: "100%", height: "100%" }}>
                    <GeographyChart isDashboard={true} data={totalPorRegion} />
                  </Box>
                </Clickable>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
