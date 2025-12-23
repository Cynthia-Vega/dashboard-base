import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Collapse, IconButton, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme"; // ajusta ruta

const TargetDesc = ({
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

  defaultExpanded = false,
  onToggle,

  // ✅ importante: en TargetList es true, acá lo dejamos igual
  expandedDivider = true,
  expandedPaddingTop = 12,

  titleWrap = false,
  headerMinHeight,
  headerPaddingY,
  expandIconPosition = "br",

  // ✅ DESCRIPCIÓN + LISTA
  description = "",
  items = [],
  renderItem,
  maxHeight = 260,
  gap = 10,
}) => {
  const colors = tokens();
  const theme = useTheme();
  const fontFamily = theme.typography?.fontFamily;

  const [displayValue, setDisplayValue] = useState(0);
  const [open, setOpen] = useState(defaultExpanded);

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

  useEffect(() => setOpen(defaultExpanded), [defaultExpanded]);

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
  const resolvedSubtitle = subtitleColor ?? colors.primary[100];
  const resolvedValue = valueColor ?? colors.green[200];

  const cardSx = {
    fontFamily,
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
            fontFamily,
            ml: 1,
            fontWeight: 900,
            color: resolvedValue,
            opacity: 0.9,
            fontSize:
              v === "h2" ? "0.45em" : v === "h3" ? "0.5em" : "0.55em",
          }}
        >
          {valueLabel}
        </Typography>
      )}
    </Typography>
  );

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

  // gap: number => px (para evitar spacing units)
  const resolvedGap = typeof gap === "number" ? `${gap}px` : gap;

  const BodyList = () => (
    <Box
      sx={{
        maxHeight,
        overflow: "auto",
        pr: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: resolvedGap,
      }}
    >
      {items.map((item, i) => (
        <Box key={item?.id ?? i}>
          {renderItem ? (
            renderItem(item, i)
          ) : (
            <Typography sx={{ fontFamily }} color={colors.primary[100]} fontWeight={900}>
              {String(item)}
            </Typography>
          )}
        </Box>
      ))}

      {!items.length && (
        <Typography color={colors.primary[100]} sx={{ opacity: 0.8, fontFamily }}>
          No hay participantes asociados.
        </Typography>
      )}
    </Box>
  );



  // ✅ ESTE Expanded deja la LISTA IGUAL al TargetList (mismo Box px/pb/pt)
const Expanded = () => (
  <Collapse in={open} timeout="auto" unmountOnExit>
    {/* ✅ Línea antes de la descripción (igual que TargetList) */}
    <Divider sx={{ borderColor: colors.primary[300] }} />

    {/* ✅ Bloque descripción con líneas suaves visibles */}
    {!!description && (
      <Box onClick={(e) => e.stopPropagation()}>
        <Typography
          sx={{
            fontFamily,
            px: 2,
            py: 1.1,              // 👈 un pelín menos para que no “empuje” tanto
            textAlign: "center",
            color: colors.primary[100],
            fontSize: "13.5px",
            lineHeight: 1.25,
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {description}
        </Typography>

        {/* ✅ Línea entre descripción y lista */}
        <Divider sx={{ borderColor: colors.primary[300], opacity: 0.7 }} />
      </Box>
    )}

    {/* ✅ LISTA: EXACTAMENTE como TargetList */}
    <Box
      sx={{
        px: 2,
        pt: description ? "12px" : `${expandedPaddingTop}px`,
        pb: 2,                          // 👈 igual que TargetList
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <BodyList />
    </Box>
  </Collapse>
);


  // =============================
  // VERTICAL / HERO
  // =============================
  if (orientation === "vertical" || variant === "hero") {
    const size = Math.max(96, mediaSize);

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

        <Expanded />
      </Box>
    );
  }

  // =============================
  // HORIZONTAL / DASH
  // =============================
  const iconSize = mediaSize;
  const py = headerPaddingY ?? 1.6;
  const minH = headerMinHeight ?? (iconSize >= 64 ? 84 : 74);

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
        {imgSrc ? mediaImage(iconSize) : icon ? mediaCircle(iconSize) : null}

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

      <Expanded />
    </Box>
  );
};

export default TargetDesc;
