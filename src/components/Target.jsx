import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Collapse, IconButton, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../theme";

const Target = ({
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

  expandable = false,
  defaultExpanded = false,
  onToggle,
  children,

  expandedDivider = true,
  expandedPaddingTop = 12,

  /* ✅ NUEVO: compat lista */
  hideValue = false,            // oculta el número (y label)
  headerOnly = false,           // solo header (pero permite expandir para mostrar children)
  titleWrap = false,            // true: permite 2 líneas
  headerMinHeight,              // fuerza alto del header
  headerPaddingY,               // override del py
  expandIconPosition = "br",    // "br" bottom-right (default), "tr" top-right
}) => {
  const colors = tokens();
  const [displayValue, setDisplayValue] = useState(0);
  const [open, setOpen] = useState(defaultExpanded);

  const formatted = useMemo(
    () => displayValue.toLocaleString("es-CL"),
    [displayValue]
  );

  useEffect(() => {
    // Si está oculto, igual animamos internamente pero no lo mostramos
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

  useEffect(() => {
    setOpen(defaultExpanded);
  }, [defaultExpanded]);

  const toggle = () => {
    if (!expandable) return;
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
    backgroundColor: resolvedBg,
    border: `1px solid ${resolvedBorder}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow ? "0 10px 22px rgba(0,0,0,0.10)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease",
    cursor: expandable ? "pointer" : "default",
    overflow: "hidden", // ✅ mantiene bordes correctos
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
        objectFit: imgFit,
        p: imgFit === "contain" ? 0.6 : 0,
        boxSizing: "border-box",
      }}
    />
  );

  const ValueWithLabel = ({ variant = "h4" }) => (
    <Typography
      variant={variant}
      fontWeight={900}
      color={resolvedValue}
      sx={{ lineHeight: 1, mt: variant === "h4" ? 0.2 : 0 }}
    >
      {formatted}
      {!!valueLabel && (
        <Typography
          component="span"
          sx={{
            ml: 1,
            fontWeight: 900,
            color: resolvedValue,
            opacity: 0.9,
            fontSize:
              variant === "h2"
                ? "0.45em"
                : variant === "h3"
                ? "0.5em"
                : "0.55em",
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
      : { right: 10, bottom: 10 }; // default "br"

  // ✅ Flecha anclada al HEADER
  const ExpandIcon = () =>
    expandable ? (
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
    ) : null;

  // ✅ estilos de título (nowrap vs 2 líneas)
  const titleSx = titleWrap
    ? {
        lineHeight: 1.15,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : {
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
      <Box sx={cardSx} onClick={toggle}>
        {/* HEADER */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pt: 3,
            px: 3,
            pb: expandable ? 4.5 : 3,
            minHeight: headerMinHeight ?? 240,
            gap: 1.0,
          }}
        >
          <ExpandIcon />

          {imgSrc ? mediaImage(size) : icon ? mediaCircle(size) : null}

          {!hideValue && !headerOnly && (
            <Box sx={{ textAlign: "center" }}>
              <ValueWithLabel variant="h2" />
            </Box>
          )}

          {!!title && (
            <Typography
              variant="h5"
              fontWeight={900}
              color={resolvedTitle}
              sx={{ textAlign: "center", ...titleSx }}
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
              sx={{ opacity: 0.9, textAlign: "center" }}
              title={subtitle}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* BODY */}
        {expandable && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            {expandedDivider && (
              <Divider sx={{ borderColor: colors.primary[300], mx: 2 }} />
            )}
            <Box
              sx={{ px: 2, pb: 2, pt: `${expandedPaddingTop}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  }

  /* =============================
     HORIZONTAL / DASH
     ============================= */
  const iconSize = mediaSize;
  const py = headerPaddingY ?? 1.6;
  const minH =
    headerMinHeight ??
    (iconSize >= 64 ? 84 : 74); // ✅ un poco más alto por defecto

  return (
    <Box sx={cardSx} onClick={toggle}>
      {/* HEADER */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1.6,
          px: 2,
          py,
          minHeight: minH,
          pr: expandable ? 6 : 2,
          pb: expandable ? 3 : py,
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

          {/* ✅ valor opcional */}
          {!hideValue && !headerOnly && <ValueWithLabel variant="h4" />}
        </Box>
      </Box>

      {/* BODY */}
      {expandable && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {expandedDivider && (
            <Divider sx={{ borderColor: colors.primary[300] }} />
          )}
          <Box
            sx={{ px: 2, pb: 2, pt: `${expandedPaddingTop}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

/* ---------------------------
   Subcomponentes de contenido
   --------------------------- */

Target.BodyList = function TargetBodyList({
  items = [],
  renderItem,
  maxHeight = 260,
  gap = 10,
  colors,
}) {
  return (
    <Box
      sx={{
        maxHeight,
        overflow: "auto",
        pr: 0.5,
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {items.map((item, i) => (
        <Box key={item?.id ?? i}>
          {renderItem ? (
            renderItem(item, i)
          ) : (
            <Typography color={colors?.primary?.[100] ?? "inherit"}>
              {String(item)}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

Target.BodyDescription = function TargetBodyDescription({
  text = "",
  children,
  colors,
}) {
  const line = colors?.primary?.[300] ?? "rgba(0,0,0,0.12)";
  const fg = colors?.primary?.[100] ?? "inherit";

  if (!text) return <>{children}</>;

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {/* línea suave */}
      <Box sx={{ height: 1, width: "100%", backgroundColor: line, opacity: 0.7 }} />

      {/* descripción centrada */}
      <Typography
        sx={{
          py: 1.2,
          px: 2,
          textAlign: "center",
          color: fg,
          fontSize: "13.5px",
          lineHeight: 1.25,
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {text}
      </Typography>

      {/* línea suave */}
      <Box sx={{ height: 1, width: "100%", backgroundColor: line, opacity: 0.7 }} />

      {/* lista / stats debajo (tal como ya te gusta) */}
      <Box sx={{ width: "100%", minWidth: 0 }}>{children}</Box>
    </Box>
  );
};



Target.BodyStats = function TargetBodyStats({ stats = [], colors, columns = 2 }) {
  return (
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
            border: `1px solid ${
              colors?.primary?.[200] ?? "rgba(0,0,0,0.08)"
            }`,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={900}
            color={colors?.primary?.[100] ?? "inherit"}
            sx={{ opacity: 0.9 }}
          >
            {s.label}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={900}
            color={colors?.green?.[200] ?? "inherit"}
            sx={{ lineHeight: 1.1 }}
          >
            {typeof s.value === "number"
              ? s.value.toLocaleString("es-CL")
              : s.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Target;
