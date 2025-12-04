import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { ParticipantesData } from "../../data/ParticipantesData";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Wolas, aquí puedes ver el gráfico circular" />
      <Box height="75vh">
        <PieChart totalPorGenero={ParticipantesData().totalPorGenero} />
      </Box>
    </Box>
  );
};

export default Pie;