import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { tokens } from "../theme";

const Target = ({
  icon,
  value = 0,
  title = "",
  titlePosition = "bottom", // "top" o "bottom"
  duration = 1000,
  orientation = "horizontal", // "horizontal" | "vertical"
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = tokens();

  const formatted = displayValue.toLocaleString("es-CL");

  // ---- ANIMACIÓN ----
  useEffect(() => {
    let animationFrameId;
    const start = performance.now();
    const target = Number(value) || 0;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.floor(progress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);




  // ================= VERTICAL =================
  if (orientation === "vertical") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
        // sin fondo, dejas que la card padre lo defina
      >
        {/* ICONO ARRIBA */}
        <Box>{icon}</Box>

        {/* NÚMERO GRANDE */}
        <Typography
          variant="h1"
          fontWeight="bold"
          color={colors.primary[100]}
          sx={{ lineHeight: 1, fontSize:"100px"}}
        >
          {formatted}
        </Typography>

        {/* TÍTULO ABAJO */}
        <Typography
          variant="h4"
          color={colors.green[200]}
        >
          {title}
        </Typography>
      </Box>
    );
  }

  // ================= HORIZONTAL (por defecto) =================
  return (
    <Box
      display="flex"
      alignItems="center"
      padding="20px"
      borderRadius="8px"
      backgroundColor={colors.primary[200]}
    >
      {/* ICONO IZQUIERDA */}
      <Box mr={2}>{icon}</Box>

      {/* TEXTO DERECHA */}
      <Box display="flex" flexDirection="column">
        {titlePosition === "top" && (
          <Typography variant="body2" color={colors.green[200]}>
            {title}
          </Typography>
        )}

        <Typography
          variant="h3"
          fontWeight="bold"
          color={colors.primary[100]}
          sx={{ lineHeight: 1 }}
        >
          {formatted}
        </Typography>

        {titlePosition === "bottom" && (
          <Typography variant="h4" color={colors.green[200]}>
            {title}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Target;