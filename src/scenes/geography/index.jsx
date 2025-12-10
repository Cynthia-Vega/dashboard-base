import { Box } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { ParticipantesData } from "../../data/ParticipantesData";

const Geography = () => {
  const { loading, frecuencyData } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;

  const totalPorRegion = frecuencyData("region_id");   // 👈 usa la helper del hook
  const colors = tokens();
  return (
    <Box m="20px" justifyContent={"center"}>
      <Header title="Geography" subtitle="Wolas, aquí puedes ver el gráfico geográfico" />

      <Box
        height="100vh"
        border={`1px solid ${colors.primary[100]}`}
        borderRadius="4px"
        maxWidth={"700px"}
        minWidth={"300px"}
        justifyContent={"center"}
        borderColor={colors.primary[200]}

      >
        <GeographyChart data={totalPorRegion} />
      </Box>
    </Box>
  );
};

export default Geography;