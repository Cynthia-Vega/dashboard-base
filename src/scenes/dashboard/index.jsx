import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { ParticipantesData } from "../../data/ParticipantesData";
import Target from "../../components/Target";



const Dashboard = () => {
  const colors = tokens();
  const { loading, frecuencyData, cumulativeFrequencyData, experienceLevelsData} = ParticipantesData();
  if (loading) return <div>Cargando datos…</div>;
  const totalPorGenero = frecuencyData("Género");
  const totalPorRegion = frecuencyData("region_id");
  const totalPorUniversidad = frecuencyData("Universidad");
  const totalPoranio = cumulativeFrequencyData("¿En qué año te uniste a RedFID? ");
  const experience = experienceLevelsData("Años de formador ");
  const carrera = frecuencyData("Indique su título profesional");
  const universidades = frecuencyData("nombre_universidad");
  const grado = frecuencyData("grado_final");


  return (
    <Box m="20px">
      {/* HEADER */}
      <Header title="DASHBOARD" subtitle="Resumen general de formadores" />

      <Box mt="-10px" mb="20px" display="flex" justifyContent="flex-end">
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

        {/* BLOQUE FORMADORES + NIVELES + GRADO */}

        {/* FORMADORES: ocupa 2 filas */}
        <Box
          gridColumn={{ xs: "span 12", md: "span 3" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          p="20px"
          pt={4.2}
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
            flexDirection="column"
            alignItems="center"
            
          >
            <Target
              icon={
                <GroupsIcon
                  sx={{ color: colors.green[200], fontSize: "200px" }}
                />
              }
              value={totalPoranio.find((c) => c.id === "2025")?.value || 0}
              title="Total"
              titlePosition="bottom"
              duration={1500}
              orientation="vertical"
            />
          </Box>

        </Box>

        {/* DERECHA: NIVELES + GRADO, en columnas pero agrupados */}
        <Box
          gridColumn={{ xs: "span 12", md: "span 8" }}
          gridRow="span 2"
          display="flex"
          flexDirection="column"
          gap={4}
          justifyContent="flex-start"
          pt={4}

        >

          {/* BLOQUE NIVELES */}
          <Box>
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.primary[100]}
              sx={{ mb: 2 }}
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
            >
              {/* NOVEL */}
              <Box
                backgroundColor={colors.primary[200]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Target
                  icon={
                    <PsychologyIcon
                      sx={{ color: colors.green[200], fontSize: "55px" }}
                    />
                  }
                  value={experience.find((c) => c.id === "novel")?.value || 0}
                  title="Novel"
                  titlePosition="bottom"
                  duration={1500}
                />
              </Box>

              {/* INTERMEDIO */}
              <Box
                backgroundColor={colors.primary[200]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Target
                  icon={
                    <PsychologyIcon
                      sx={{ color: colors.green[200], fontSize: "55px" }}
                    />
                  }
                  value={experience.find((c) => c.id === "intermedio")?.value || 0}
                  title="Intermedio"
                  titlePosition="bottom"
                  duration={1500}
                />
              </Box>

              {/* EXPERTO */}
              <Box
                backgroundColor={colors.primary[200]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Target
                  icon={
                    <PsychologyIcon
                      sx={{ color: colors.green[200], fontSize: "55px" }}
                    />
                  }
                  value={experience.find((c) => c.id === "experto")?.value || 0}
                  title="Experto"
                  titlePosition="bottom"
                  duration={1500}
                />
              </Box>
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
            >
              {/* LICENCIATURA */}
              <Box
                backgroundColor={colors.primary[200]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Target
                  icon={
                    <HistoryEduIcon
                      sx={{ color: colors.green[200], fontSize: "55px" }}
                    />
                  }
                  value={grado.find((c) => c.id === "Licenciatura")?.value || 0}
                  title="Licenciatura"
                  titlePosition="bottom"
                  duration={1500}
                />
              </Box>

              {/* MAGÍSTER */}
              <Box
                backgroundColor={colors.primary[200]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Target
                  icon={
                    <HistoryEduIcon
                      sx={{ color: colors.green[200], fontSize: "55px" }}
                    />
                  }
                  value={grado.find((c) => c.id === "Magíster")?.value || 0}
                  title="Magíster"
                  titlePosition="bottom"
                  duration={1500}
                />
              </Box>

              {/* DOCTORADO */}
              <Box
                backgroundColor={colors.primary[200]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
              >
                <Target
                  icon={
                    <HistoryEduIcon
                      sx={{ color: colors.green[200], fontSize: "55px" }}
                    />
                  }
                  value={grado.find((c) => c.id === "Doctorado")?.value || 0}
                  title="Doctorado"
                  titlePosition="bottom"
                  duration={1500}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* TÍTULO PROFESIONAL - BLOQUE COMPLETO */}
        <Box
          gridColumn={{ xs: "span 12", sm: "3", md: "span 12" }}
          gridRow="span 1"
          backgroundColor={colors.primary[200]}
          display="flex"
          flexDirection="column"
          p="20px"
        >

          {/* TÍTULO */}
          <Typography
            variant="h4"
            fontWeight="600"
            color={colors.primary[100]}
            textAlign="left"
            sx={{ mb: 2 }}
          >
            TÍTULO PROFESIONAL
          </Typography>

          {/* GRID DE 4 TARGETS AL LADO */}
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap="20px"
          >

            {/* Educador/a de Párvulos */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Educador/a de Párvulos")?.value || 0}
              title="Educador/a de Párvulos"
              duration={1500}
            />

            {/* Profesor/a Educación Básica */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Profesor/a de Educación Básica")?.value || 0}
              title="Profesor/a de Educación Básica"
              duration={1500}
            />

            {/* Profesor/a Educación Media */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Profesor/a de Educación Media")?.value || 0}
              title="Profesor/a de Educación Media"
              duration={1500}
            />

            {/* Otro */}
            <Target
              icon={<SchoolIcon sx={{ color: colors.green[200], fontSize: 55 }} />}
              value={carrera.find((c) => c.id === "Otro")?.value || 0}
              title="Otro"
              duration={1500}
            />

          </Box>
        </Box>





        {/* ROW 4 - TRAYECTORIA Y UNIVERSIDADES */}

        {/* CARD IZQUIERDA: TRAYECTORIA */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 7" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          display="flex"
          flexDirection="column"
          height="350px" 
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[200]}`}
            p="15px"
          >
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.primary[100]}
            >
              TRAYECTORIA RedFID
            </Typography>
          </Box>

          {/* Contenido */}
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
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[200]}`}
            p="15px"
          >
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.primary[100]}
            >
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
                <Typography
                  color={colors.green[200]}
                  variant="h5"
                  fontWeight="600"
                >
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



        {/* ROW 5 - DONUT MAPA */}

        {/* Card: Regiones abarcadas */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
        >
          <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
            Regiones abarcadas
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size={125} data={totalPorRegion} />
          </Box>
        </Box>


        {/* Card: Distribución por región */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 12", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
          display="flex"
          flexDirection="column"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
            color={colors.primary[100]}
          >
            Distribución por región
          </Typography>

          <Box flex="1">
            <Box height="260px">
              <GeographyChart isDashboard={true} data={totalPorRegion} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;