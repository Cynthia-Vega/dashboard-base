import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import {
  getFontPack,
  getTitleSx,
  TargetMedia,
  useCountUp,
  ValueWithLabel,
} from "./targetShared";

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

  const { fontFamily, FW_BOLD, FW_MED } = getFontPack(theme);
  const { formatted } = useCountUp({ value, duration, locale: "es-CL" });

  const resolvedBg = bgColor ?? colors.primary[200];
  const resolvedBorder = borderColor ?? "rgba(0,0,0,0.10)";
  const resolvedTitle = titleColor ?? colors.primary[100];
  const resolvedSubtitle = subtitleColor ?? colors.primary[100];
  const resolvedValue = valueColor ?? colors.green[200];


  const cardSx = {
    fontFamily,
    "&, & *": { fontFamily },
    "& .MuiTypography-root": { fontFamily },

    backgroundColor: resolvedBg,
    border: `1px solid ${resolvedBorder}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow ? "10px 10px 22px rgba(0,0,0,0.10)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease",
    cursor: "default",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: shadow ? "10px 14px 26px rgba(0,0,0,0.14)" : "none",
    },
    ...(fullWidth ? { width: "100%" } : {}),
    ...sx,
  };

  const titleSx = getTitleSx({ titleWrap, fontFamily, withFamily: false });

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
            textAlign: "center",
          }}
        >
          <TargetMedia
            imgSrc={imgSrc}
            icon={icon}
            size={size}
            title={title}
            imgFit={imgFit}
            imgRound={imgRound}
            border={resolvedBorder}
          />

          <ValueWithLabel
            variant="h2"
            formatted={formatted}
            valueLabel={valueLabel}
            fontFamily={fontFamily}
            fontWeight={FW_BOLD}
            color={resolvedValue}
          />

          {!!title && (
            <Typography
              variant="h5"
              fontWeight={FW_BOLD}
              color={resolvedTitle}
              sx={{ ...titleSx, textAlign: "center", whiteSpace: "normal" }}
              title={title}
            >
              {title}
            </Typography>
          )}

          {!!subtitle && (
            <Typography
              variant="caption"
              fontWeight={FW_MED}
              color={resolvedSubtitle}
              sx={{ opacity: 0.9, textAlign: "center" }}
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
        <TargetMedia
          imgSrc={imgSrc}
          icon={icon}
          size={iconSize}
          title={title}
          imgFit={imgFit}
          imgRound={imgRound}
          border={resolvedBorder}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          {!!title && (
            <Typography
              variant="h6"             
              fontWeight={FW_BOLD}
              color={resolvedTitle}
              sx={{ ...titleSx, mb: 0.6 }}
              title={title}
            >
              {title}
            </Typography>
          )}

          {!!subtitle && (
            <Typography
              variant="caption"
              fontWeight={FW_MED}
              color={resolvedSubtitle}
              sx={{
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

          <ValueWithLabel
            variant="h4"
            formatted={formatted}
            valueLabel={valueLabel}
            fontFamily={fontFamily}
            fontWeight={FW_BOLD}
            color={resolvedValue}
            sx={{ mt: 0.2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TargetMin;
