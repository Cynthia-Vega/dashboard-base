import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import SchoolIcon from '@mui/icons-material/School';
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
  console.log("carreriña", carrera)


  return (
    <Box m="20px">
      {/* HEADER */}
      
        <Header title="DASHBOARD" subtitle="Resumen general de formadores" />
        
        <Box mt="-10px" mb="20px" display="flex" justifyContent="flex-end">
          <Button
          onClick={()=>alert("Próximamente podrá descargar el reporte")}
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
        gridAutoRows="130px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 3" }}
          backgroundColor={colors.primary[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.primary[100]}
              >
                FORMADORES
              </Typography>
            {/*   <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.green[200]}
              >
                $59,342.32
              </Typography> */}
              <Target icon={<GroupsIcon sx={{ color: colors.green[200], fontSize: "55px" }}/>} value = {totalPoranio.find((c)=>c.id === "2025")?.value || 0} title = "Total" titlePosition = "bottom" duration = {1500}/>
            </Box>
          
        </Box>

        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 3" }}
          backgroundColor={colors.primary[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.primary[100]}
              >
                NIVELES
              </Typography>
          <Target icon={<PsychologyIcon sx={{ color: colors.green[200], fontSize: "55px" }}/>} value = {experience.find((c)=>c.id === "novel")?.value || 0} title = "Novel" titlePosition = "bottom" duration = {1500}/>
          </Box>
        </Box>
        
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 3" }}
          backgroundColor={colors.primary[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.primary[100]}
              >
                  
              </Typography>
          <Target icon={<PsychologyIcon sx={{ color: colors.green[200], fontSize: "55px" }}/>} value = {experience.find((c)=>c.id === "intermedio")?.value || 0} title = "Intermedio" titlePosition = "bottom" duration = {1500}/>
          </Box>
        </Box>

        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 3" }}
          backgroundColor={colors.primary[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.primary[100]}
              >
                  
              </Typography>
          <Target icon={<PsychologyIcon sx={{ color: colors.green[200], fontSize: "55px" }}/>} value = {experience.find((c)=>c.id === "experto")?.value || 0} title = "Experto" titlePosition = "bottom" duration = {1500}/>
          </Box>
        </Box>
        

        {/* ROW 2 */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 8" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.primary[100]}
              >
                TRAYECTORIA
              </Typography>

            </Box>
            
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart data = {totalPoranio} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[200]}`}
            colors={colors.primary[100]}
            p="15px"
          >
            <Typography color={colors.primary[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[200]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.green[200]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.primary[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.primary[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.green[200]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>
        </Box>
        <Box display={"flex"} flexWrap={"wrap"}>

        {/* ROW 3 */}
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="3px"
          minWidth={"400px"}
        >
          <Typography variant="h5" fontWeight="600">
            Regiones abarcadas
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" data={totalPorRegion} />
            <Typography
              variant="h5"
              color={colors.green[200]}
              sx={{ mt: "15px" }}
            >
              {/* $48,352 revenue generated */}
            </Typography>
            {/* <Typography></Typography> */}
          </Box>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          minWidth={"300px"}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Cantidades por universidad
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} data={totalPorUniversidad}/>
          </Box>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          padding="30px"
          minWidth={"300px"}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Distribución por región
          </Typography>
          <Box height="300px">
            <GeographyChart isDashboard={true} data={totalPorRegion}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
