import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { ParticipantesData } from "../../data/ParticipantesData";

const Bar = () => {
  const Data = ParticipantesData();
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Wolas, aquí puedes ver el gráfico de barras" />
      <Box height="75vh">
         <BarChart data={Data.totalPorUniversidad}/>
      </Box>
    </Box>
  );
};

export default Bar;