import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const TargetMin = ({
  title = "",
  subtitle = "",
  value = 0,
  valueLabel = "",

  imgSrc,
  icon,

  orientation = "horizontal",
  variant = "dash",
  fullWidth = false,

  bgColor,
  radius = 18,
  shadow = true,
  borderColor,
  titleColor,
  valueColor,
  subtitleColor,
  sx,

  mediaSize = 44,
  imgFit = "cover",
  imgRound = true,

  duration = 900,

  titleWrap = false,
  headerMinHeight,
  headerPaddingY,
}) => {
  const colors = tokens();
  const theme = useTheme();
  const fontFamily = theme.typography?.fontFamily;

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

  const resolvedBg = bgColor ?? colors.primary[200];
  const resolvedBorder = borderColor ?? "rgba(0,0,0,0.10)";
  const resolvedTitle = titleColor ?? colors.primary[100];
  const resolvedSubtitle = subtitleColor ?? colors.primary[100];
  const resolvedValue = valueColor ?? colors.green[200];

  const cardSx = {
    fontFamily,
    backgroundColor: resolvedBg,
    border: `1px solid ${resolvedBorder}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow ? "0 10px 22px rgba(0,0,0,0.10)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease",
    cursor: "default",
    overflow: "hidden",
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
        "& svg": { width: "68%", height: "68%", fontSize: "unset !important" },
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
        objectFit: imgFit,
        p: imgFit === "contain" ? 0.6 : 0,
        boxSizing: "border-box",
      }}
    />
  );

  const ValueWithLabel = ({ variant: v = "h4" }) => (
    <Typography
      variant={v}
      fontWeight={900}
      color={resolvedValue}
      sx={{ fontFamily, lineHeight: 1, mt: v === "h4" ? 0.2 : 0 }}
    >
      {formatted}
      {!!valueLabel && (
    <Typography
      component="span"
      sx={{
        ml: 1,
        fontWeight: 900,
        opacity: 0.9,
        fontSize: v === "h2" ? "0.60em" : v === "h3" ? "0.65em" : "0.70em",
        position: "relative",
        top: v === "h2" ? "-0.10em" : "-0.08em",
        verticalAlign: "middle",
        lineHeight: 1,
      }}
    >
  {valueLabel}
</Typography>
      )}
    </Typography>
  );

  const titleSx = titleWrap
    ? {
        fontFamily,
        lineHeight: 1.15,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : {
        fontFamily,
        lineHeight: 1.05,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      };

  /* =============================
     VERTICAL / HERO
     ============================= */
  if (orientation === "vertical" || variant === "hero") {
    const size = Math.max(96, mediaSize);

    return (
      <Box sx={cardSx}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pt: 3,
            px: 3,
            pb: 3,
            minHeight: headerMinHeight ?? 240,
            gap: 1.0,
          }}
        >
          {imgSrc ? mediaImage(size) : icon ? mediaCircle(size) : null}

          <Box sx={{ textAlign: "center" }}>
            <ValueWithLabel variant="h2" />
          </Box>

          {!!title && (
            <Typography
              variant="h5"
              fontWeight={900}
              color={resolvedTitle}
              sx={{ ...titleSx, textAlign: "center" }}
              title={title}
            >
              {title}
            </Typography>
          )}

          {!!subtitle && (
            <Typography
              variant="body2"
              fontWeight={700}
              color={resolvedSubtitle}
              sx={{ fontFamily, opacity: 0.9, textAlign: "center" }}
              title={subtitle}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  /* =============================
     HORIZONTAL / DASH
     ============================= */
  const iconSize = mediaSize;
  const py = headerPaddingY ?? 1.6;
  const minH = headerMinHeight ?? (iconSize >= 64 ? 84 : 74);

  return (
    <Box sx={cardSx}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1.6,
          px: 2,
          py,
          minHeight: minH,
        }}
      >
        {imgSrc ? mediaImage(iconSize) : icon ? mediaCircle(iconSize) : null}

        <Box sx={{ minWidth: 0, flex: 1 }}>
          {!!title && (
            <Typography
              variant="body1"
              fontWeight={900}
              color={resolvedTitle}
              sx={{titleSx, mb:0.6}}
              title={title}
            >
              {title}
            </Typography>
          )}

          {!!subtitle && (
            <Typography
              variant="caption"
              fontWeight={700}
              color={resolvedSubtitle}
              sx={{
                fontFamily,
                opacity: 0.9,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mt: 0.25,
              }}
              title={subtitle}
            >
              {subtitle}
            </Typography>
          )}

          <ValueWithLabel variant="h4" />
        </Box>
      </Box>
    </Box>
  );
};

export default TargetMin;
