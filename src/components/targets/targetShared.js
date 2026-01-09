import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

/**
 * Helpers compartidos para Targets.
 * - Evita duplicación de count-up, estilos de título y media (img/icon)
 * - Incluye toggle seguro para iOS (touch -> click doble)
 */

export const getFontPack = (theme) => {
  const fontFamily = theme.typography?.fontFamily || "inherit";
  return {
    fontFamily,
    FW_BOLD: theme.typography?.fontWeightBold ?? 700,
    FW_MED: theme.typography?.fontWeightMedium ?? 600,
    FW_REG: theme.typography?.fontWeightRegular ?? 400,
  };
};

export const useCountUp = ({ value = 0, duration = 900, locale = "es-CL" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  const formatted = useMemo(
    () => (Number(displayValue) || 0).toLocaleString(locale),
    [displayValue, locale]
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

  return { displayValue, formatted };
};

export const getTitleSx = ({ titleWrap = false, fontFamily, withFamily = true }) => {
  const base = titleWrap
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

  return withFamily ? { fontFamily, ...base } : base;
};

export const TargetMedia = ({
  imgSrc,
  icon,
  size = 44,
  title = "",
  imgFit = "cover",
  imgRound = true,
  border = "rgba(0,0,0,0.10)",
}) => {
  if (imgSrc) {
    return (
      <Box
        component="img"
        src={imgSrc}
        alt={title}
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          border: `1px solid ${border}`,
          backgroundColor: "rgba(255,255,255,0.75)",
          overflow: "hidden",
          borderRadius: imgRound ? "50%" : "12px",
          objectFit: imgFit,
          p: imgFit === "contain" ? 0.6 : 0,
          boxSizing: "border-box",
        }}
      />
    );
  }

  if (icon) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          border: `1px solid ${border}`,
          backgroundColor: "rgba(0,0,0,0.03)",
          overflow: "hidden",
          "& svg": { width: "68%", height: "68%", fontSize: "unset !important" },
        }}
      >
        {icon}
      </Box>
    );
  }

  return null;
};

export const ValueWithLabel = ({
  formatted,
  valueLabel = "",
  variant = "h4",
  fontFamily,
  fontWeight = 700,
  color,
  sx,
}) => {
  return (
    <Typography
      variant={variant}
      fontWeight={fontWeight}
      color={color}
      sx={{ fontFamily, lineHeight: 1, ...(sx || {}) }}
    >
      {formatted}
      {!!valueLabel && (
        <Typography
          component="span"
          sx={{
            fontFamily,
            ml: 1,
            fontWeight,
            opacity: 0.9,
            fontSize:
              variant === "h2" ? "0.60em" : variant === "h3" ? "0.65em" : "0.70em",
            position: "relative",
            top: variant === "h2" ? "-0.10em" : "-0.08em",
            verticalAlign: "middle",
            lineHeight: 1,
          }}
        >
          {valueLabel}
        </Typography>
      )}
    </Typography>
  );
};

/**
 * Toggle seguro para iOS:
 * - Evita doble fire de touch -> click
 * - Debounce de toggles para que no "parpadee"
 */
export const useIOSSafeToggle = ({ defaultOpen = false, onToggle, debounceMs = 350 } = {}) => {
  const [open, setOpen] = useState(defaultOpen);

  const ignoreClickRef = useRef(false);
  const lastToggleRef = useRef(0);

  useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  const toggle = () => {
    const now = Date.now();
    if (now - lastToggleRef.current < debounceMs) return;
    lastToggleRef.current = now;

    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  const cardHandlers = {
    onClick: () => {
      if (ignoreClickRef.current) return;
      toggle();
    },
    onTouchEnd: (e) => {
      e.preventDefault();
      ignoreClickRef.current = true;
      toggle();
      window.setTimeout(() => (ignoreClickRef.current = false), 450);
    },
  };

  const iconHandlers = {
    onClick: (e) => {
      e.stopPropagation();
      if (ignoreClickRef.current) return;
      toggle();
    },
    onTouchEnd: (e) => {
      e.stopPropagation();
      e.preventDefault();
      ignoreClickRef.current = true;
      toggle();
      window.setTimeout(() => (ignoreClickRef.current = false), 450);
    },
  };

  const touchSx = {
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  };

  return { open, setOpen, toggle, cardHandlers, iconHandlers, touchSx };
};
