import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { ParticipantesData } from "../../data/ParticipantesData";

const Line = () => {
  const { loading, frecuencyData } = ParticipantesData();
  if (loading) return <div>Cargando datos…</div>;
  const totalPoranio = frecuencyData("¿En qué año te uniste a RedFID? ");
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Wolas, aquí puedes ver el gráfico de líneas" />
      <Box height="75vh">
        <LineChart data = {totalPoranio} isDashboard={false} />
      </Box>
    </Box>
  );
};

export default Line;