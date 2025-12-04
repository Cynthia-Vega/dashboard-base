import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({size = "40" , data, totalRegions = 16}) => {
  const colors = tokens();
  let progress = 0;

   if (Array.isArray(data) && totalRegions > 0) {
    const regionesConParticipantes = data.filter(
      (r) => typeof r?.value === "number" && r.value > 0
    ).length;

    
    progress = regionesConParticipantes / totalRegions;
  }


  // cerrar en [0,1]
  const clamped = Math.min(Math.max(progress, 0), 1);
  const angle = clamped * 360;

  return (
    console.log("Progreso del ProgressCircle:", clamped, angle),
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