import { Box} from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ size = 40, data, totalRegions = 16 }) => {
  const colors = tokens();

  let progress = 0;
  let regionesConParticipantes = 0;

  if (Array.isArray(data) && totalRegions > 0) {
    regionesConParticipantes = data.filter(
      (r) => typeof r?.value === "number" && r.value > 0
    ).length;

    progress = regionesConParticipantes / totalRegions;
  }

  // cerrar en [0,1]
  const clamped = Math.min(Math.max(progress, 0), 1);
  const angle = clamped * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[200]} 55%, transparent 56%),
          conic-gradient(transparent 0deg ${angle}deg, ${colors.azul[100]} ${angle}deg 360deg),
          ${colors.green[200]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.primary[100],
        fontWeight: 600,
        fontSize: size * 0.2, // escala un poco el texto según el tamaño
      }}
    >
      {progress*100}%
    </Box>
  );
};

export default ProgressCircle;
