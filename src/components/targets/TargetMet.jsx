import React, { useState } from "react";
import { Box, Typography, Collapse, IconButton, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const TargetMet = ({
  title = "",
  orientation = "horizontal",
  variant = "dash",
  fullWidth = false,

  bgColor,
  radius = 18,
  shadow = true,
  borderColor,
  titleColor,
  sx,

  defaultExpanded = false,
  onToggle,

  expandedDivider = true,
  expandedPaddingTop = 12,

  titleWrap = false,
  headerMinHeight,
  headerPaddingY,
  expandIconPosition = "br",

  // ✅ MÉTRICAS
  stats = [],
  columns = 2,
}) => {
  const colors = tokens();
  const theme = useTheme();
  const fontFamily = theme.typography?.fontFamily;

  const [open, setOpen] = useState(defaultExpanded);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  const resolvedBg = bgColor ?? colors.primary[200];
  const resolvedBorder = borderColor ?? "rgba(0,0,0,0.10)";
  const resolvedTitle = titleColor ?? colors.primary[100];

  const cardSx = {
    fontFamily, // ✅ FIX fuente
    backgroundColor: resolvedBg,
    border: `1px solid ${resolvedBorder}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow ? "0 10px 22px rgba(0,0,0,0.10)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease",
    cursor: "pointer",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: shadow ? "0 14px 26px rgba(0,0,0,0.14)" : "none",
    },
    ...(fullWidth ? { width: "100%" } : {}),
    ...sx,
  };

  const expandIconSx =
    expandIconPosition === "tr"
      ? { right: 10, top: 10 }
      : { right: 10, bottom: 10 };

  const ExpandIcon = () => (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      sx={{
        position: "absolute",
        ...expandIconSx,
        color: colors.primary[100],
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .2s ease",
        zIndex: 2,
        width: 36,
        height: 36,
        border: `1px solid ${resolvedBorder}`,
        backgroundColor: "rgba(255,255,255,0.70)",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.90)" },
      }}
    >
      <ExpandMoreIcon />
    </IconButton>
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

  const BodyStats = () => (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${columns}, minmax(0, 1fr))`}
      gap="10px"
    >
      {stats.map((s, i) => (
        <Box
          key={`${s.label}-${i}`}
          sx={{
            backgroundColor: colors?.primary?.[300] ?? "rgba(0,0,0,0.06)",
            borderRadius: "10px",
            p: "10px 12px",
            border: `1px solid ${colors?.primary?.[200] ?? "rgba(0,0,0,0.08)"}`,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={900}
            color={colors?.primary?.[100] ?? "inherit"}
            sx={{ fontFamily, opacity: 0.9 }}
          >
            {s.label}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={900}
            color={colors?.green?.[200] ?? "inherit"}
            sx={{ fontFamily, lineHeight: 1.1 }}
          >
            {typeof s.value === "number" ? s.value.toLocaleString("es-CL") : s.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  /* =============================
     VERTICAL / HERO
     ============================= */
  if (orientation === "vertical" || variant === "hero") {
    return (
      <Box sx={cardSx} onClick={toggle}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pt: 3,
            px: 3,
            pb: 4.5,
            minHeight: headerMinHeight ?? 240,
            gap: 1.0,
          }}
        >
          <ExpandIcon />

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
        </Box>

        <Collapse in={open} timeout="auto" unmountOnExit>
          {expandedDivider && (
            <Divider sx={{ borderColor: colors.primary[300], mx: 2 }} />
          )}
          <Box
            sx={{ px: 2, pb: 2, pt: `${expandedPaddingTop}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <BodyStats />
          </Box>
        </Collapse>
      </Box>
    );
  }

  /* =============================
     HORIZONTAL / DASH
     ============================= */
  const py = headerPaddingY ?? 1.6;
  const minH = headerMinHeight ?? 74;

  return (
    <Box sx={cardSx} onClick={toggle}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1.6,
          px: 2,
          py,
          minHeight: minH,
          pr: 6,
          pb: 3,
        }}
      >
        <ExpandIcon />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          {!!title && (
            <Typography
              variant="body1"
              fontWeight={900}
              color={resolvedTitle}
              sx={titleSx}
              title={title}
            >
              {title}
            </Typography>
          )}
        </Box>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {expandedDivider && <Divider sx={{ borderColor: colors.primary[300] }} />}
        <Box
          sx={{ px: 2, pb: 2, pt: `${expandedPaddingTop}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <BodyStats />
        </Box>
      </Collapse>
    </Box>
  );
};

export default TargetMet;
