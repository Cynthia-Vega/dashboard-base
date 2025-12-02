import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { ParticipantesData } from "../../data/ParticipantesData";

const Geography = () => {
  const Data = ParticipantesData()
  const colors = tokens();
  return (
    <Box m="20px">
      <Header title="Geography" subtitle="Wolas, aquí puedes ver el gráfico geográfico" />

      <Box
        height="75vh"
        border={`1px solid ${colors.primary[100]}`}
        borderRadius="4px"
      >
        <GeographyChart data={Data.byRegionForMap} />
        {console.log("Data en Geography:", Data)}
      </Box>
    </Box>
  );
};

export default Geography;