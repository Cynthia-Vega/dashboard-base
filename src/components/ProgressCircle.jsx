import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
  const colors = tokens();
  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[200]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.azul[100]} ${angle}deg 360deg),
            ${colors.green[200]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;