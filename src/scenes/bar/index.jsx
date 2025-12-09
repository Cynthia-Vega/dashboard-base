import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { ParticipantesData } from "../../data/ParticipantesData";


const Bar = () => {
  const { loading, frecuencyData } = ParticipantesData();
  if (loading) return <div>Cargando datos…</div>;
  const totalPorUniversidad = frecuencyData("Universidad");
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Wolas, aquí puedes ver el gráfico de barras" />
      <Box height="75vh">
         <BarChart data={totalPorUniversidad}/>
      </Box>
    </Box>
  );
};

export default Bar;