import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { tokens } from "../theme";

const Target = ({
  title = "",
  value = 0,
  imgSrc,
  icon,

  orientation = "horizontal", // "horizontal" | "vertical"
  variant = "dash", // "dash" | "hero"
  fullWidth = false,

  bgColor,
  radius = 18,
  shadow = true,
  borderColor,
  titleColor,
  valueColor,
  sx,

  // ✅ NUEVO: control de tamaño y “recorte” de imagen (logos vs fotos)
  mediaSize = 44, // tamaño del círculo/logo en modo dash (y base para hero si quieres)
  imgFit = "cover", // "cover" (fotos) | "contain" (logos)
  imgRound = true, // true = círculo, false = cuadrado redondeado

  duration = 900,
}) => {
  const colors = tokens();
  const [displayValue, setDisplayValue] = useState(0);

  const formatted = useMemo(
    () => displayValue.toLocaleString("es-CL"),
    [displayValue]
  );

  useEffect(() => {
    let raf;
    const start = performance.now();
    const target = Number(value) || 0;

    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  const resolvedBg = bgColor ?? colors.primary[200]; // blanco
  const resolvedBorder = borderColor ?? "rgba(0,0,0,0.10)";
  const resolvedTitle = titleColor ?? colors.primary[100]; // negro
  const resolvedValue = valueColor ?? colors.green[200]; // turquesa

  const cardSx = {
    backgroundColor: resolvedBg,
    border: `1px solid ${resolvedBorder}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow ? "0 10px 22px rgba(0,0,0,0.10)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: shadow ? "0 14px 26px rgba(0,0,0,0.14)" : "none",
    },
    ...(fullWidth ? { width: "100%" } : {}),
    ...sx,
  };

  const mediaCircle = (size) => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        border: `1px solid ${resolvedBorder}`,
        backgroundColor: "rgba(0,0,0,0.03)",
        overflow: "hidden",
        "& svg": {
          width: "68%",
          height: "68%",
          fontSize: "unset !important",
        },
      }}
    >
      {icon}
    </Box>
  );

  const mediaImage = (size) => (
    <Box
      component="img"
      src={imgSrc}
      alt={title}
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        border: `1px solid ${resolvedBorder}`,
        backgroundColor: "rgba(255,255,255,0.75)",
        overflow: "hidden",
        borderRadius: imgRound ? "50%" : "12px",
        objectFit: imgFit, // ✅ contain para logos
        // ayuda a logos con fondo transparente: deja “aire” dentro
        p: imgFit === "contain" ? 0.6 : 0,
        boxSizing: "border-box",
      }}
    />
  );

  // ✅ HERO (Formadores)
  if (orientation === "vertical" || variant === "hero") {
    const size = Math.max(96, mediaSize); // por defecto 96+, puedes pasar mediaSize=120 etc

    return (
      <Box
        sx={{
          ...cardSx,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: 3,
          pb: 3,
          px: 3,
          minHeight: 240,
          gap: 1.2,
        }}
      >
        {imgSrc ? mediaImage(size) : icon ? mediaCircle(size) : null}

        <Typography
          variant="h2"
          fontWeight={900}
          color={resolvedValue}
          sx={{ lineHeight: 0.9, mt: 0.5 }}
        >
          {formatted}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={900}
          color={resolvedTitle}
          sx={{ lineHeight: 1.1, textAlign: "center" }}
        >
          {title}
        </Typography>
      </Box>
    );
  }

  // ✅ DASH (Niveles/Grado/Universidades): barra compacta
  const iconSize = mediaSize;

  return (
    <Box
      sx={{
        ...cardSx,
        display: "flex",
        alignItems: "center",
        gap: 1.4,
        px: 2,
        py: 1.4,
        minHeight: iconSize >= 64 ? 84 : 66, // si haces el logo grande, sube un poco el alto
      }}
    >
      {imgSrc ? mediaImage(iconSize) : icon ? mediaCircle(iconSize) : null}

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={900}
          color={resolvedTitle}
          sx={{
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={title}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={900}
          color={resolvedValue}
          sx={{ lineHeight: 1, mt: 0.2 }}
        >
          {formatted}
        </Typography>
      </Box>
    </Box>
  );
};

export default Target;
