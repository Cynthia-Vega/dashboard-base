import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { ParticipantesData } from "../../data/ParticipantesData";

const Pie = () => {
  const { loading, frecuencyData } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;

  const totalPorGenero = frecuencyData("Género");   // 👈 usa la helper del hook
  console.log("totalPorGenero:", totalPorGenero);

  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Wolas, aquí puedes ver el gráfico circular" />
      <Box height="75vh">
        <PieChart data={totalPorGenero} />
      </Box>
    </Box>
  );
};

export default Pie;