import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { tokens } from "../theme";

const Target = ({
  icon,
  value = 0,
  title = "",
  titlePosition = "bottom", // "top" o "bottom"
  duration = 1000, // duración de la animación en ms
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = tokens();

  useEffect(() => {
    let animationFrameId;
    const startTime = performance.now();
    const target = Number(value) || 0;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1); // [0, 1]
      const current = Math.floor(progress * target);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return (
    <Box
      display="flex"
      alignItems="center"
      padding="30px"
      borderRadius="8px"
      backgroundColor={colors.primary[200]}
    >
      {/* ICONO */}
      <Box mr={2}>{icon}</Box>

      {/* TEXTO */}
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
          {displayValue.toLocaleString("es-CL")}
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
