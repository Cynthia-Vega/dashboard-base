import React, { useEffect, useState } from "react";
import { Box, Typography, Collapse, IconButton, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import {
  getFontPack,
  getTitleSx,
  TargetMedia,
  useCountUp,
  ValueWithLabel,
} from "./targetShared";

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

  expandedPaddingTop = 12,

  titleWrap = false,
  headerMinHeight,
  headerPaddingY,
  expandIconPosition = "br",

  description = "",
  descriptionTitle = "",
  formadores = "",

  items = [],
  renderItem,

  maxHeight = 260,
  gap = 10,
}) => {
  const colors = tokens();
  const theme = useTheme();

  const { fontFamily, FW_BOLD, FW_MED } = getFontPack(theme);
  const FW_LIST = 600;

  const { formatted } = useCountUp({ value, duration, locale: "es-CL" });

  
  const [open, setOpen] = useState(!!defaultExpanded);

  useEffect(() => {
    setOpen(!!defaultExpanded);
  }, [defaultExpanded]);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  
  const touchSx = {
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  };

  const resolvedBg = bgColor ?? colors.primary[200];
  const resolvedBorder = borderColor ?? "rgba(0,0,0,0.10)";
  const resolvedTitle = titleColor ?? colors.primary[100];
  const resolvedSubtitle = subtitleColor ?? colors.primary[100];
  const resolvedValue = valueColor ?? colors.green[200];

  const cardSx = {
    fontFamily,
    "&, & *": { fontFamily },
    "& .MuiTypography-root": { fontFamily },

    ...touchSx,

    backgroundColor: resolvedBg,
    border: `1px solid ${resolvedBorder}`,
    borderRadius: `${radius}px`,
    boxShadow: shadow ? "10px 10px 22px rgba(0,0,0,0.10)" : "none",
    transition: "transform 140ms ease, box-shadow 140ms ease",
    cursor: "pointer",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: shadow ? "10px 14px 26px rgba(0,0,0,0.14)" : "none",
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
        ...touchSx,
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

  const titleSx = getTitleSx({ titleWrap, fontFamily, withFamily: true });
  const resolvedGap = typeof gap === "number" ? `${gap}px` : gap;

  const listItemWrapperSx = {
    fontFamily,
    "&, & *": { fontFamily },
    "& .MuiTypography-root": {
      fontFamily,
      fontWeight: `${FW_LIST} !important`,
    },
  };

  const BodyList = () => (
    <Box
      sx={{
        maxHeight,
        overflow: "auto",
        pr: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: resolvedGap,
        fontFamily,
      }}
    >
      {items.map((item, i) => (
        <Box key={item?.id ?? i} sx={listItemWrapperSx}>
          {renderItem ? (
            renderItem(item, i)
          ) : (
            <Typography
              variant="body2"
              color={colors.primary[100]}
              sx={{ fontFamily, fontWeight: FW_LIST, lineHeight: 1.2 }}
            >
              {String(item)}
            </Typography>
          )}
        </Box>
      ))}

      {!items.length && (
        <Typography
          variant="body2"
          color={colors.primary[100]}
          sx={{ opacity: 0.8, fontFamily, fontWeight: FW_MED }}
        >
          No hay participantes asociados.
        </Typography>
      )}
    </Box>
  );

  const Expanded = () => (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Divider sx={{ borderColor: colors.primary[300] }} />

      {!!description && (
        <Box onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              px: 2,
              py: 1.1,
              textAlign: "center",
              color: colors.primary[100],
              fontFamily,
            }}
          >
            {!!descriptionTitle && (
              <Typography
                variant="body2"
                sx={{
                  fontFamily,
                  fontWeight: "900 !important",
                  fontSize: "13.8px",
                  lineHeight: 1.2,
                  mb: 0.5,
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {descriptionTitle}
              </Typography>
            )}

            {!!formadores && (
              <Typography
                variant="body2"
                sx={{
                  fontFamily,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "13.2px",
                  lineHeight: 1.2,
                  mb: 0.55,
                  opacity: 0.95,
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {Array.isArray(formadores)
                  ? formadores.filter(Boolean).join(", ")
                  : formadores}
              </Typography>
            )}

            <Typography
              variant="body2"
              sx={{
                fontFamily,
                fontWeight: FW_MED,
                fontSize: "13.5px",
                lineHeight: 1.25,
                whiteSpace: "normal",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {description}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: colors.primary[300], opacity: 0.7 }} />
        </Box>
      )}

      <Box
        sx={{
          px: 2,
          pt: description ? "12px" : `${expandedPaddingTop}px`,
          pb: 2,
          fontFamily,
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

          <TargetMedia
            imgSrc={imgSrc}
            icon={icon}
            size={size}
            title={title}
            imgFit={imgFit}
            imgRound={imgRound}
            border={resolvedBorder}
          />

          <Box sx={{ textAlign: "center" }}>
            <ValueWithLabel
              variant="h2"
              formatted={formatted}
              valueLabel={valueLabel}
              fontFamily={fontFamily}
              fontWeight={FW_BOLD}
              color={resolvedValue}
            />
          </Box>

          {!!title && (
            <Typography
              variant="h5"
              fontWeight={FW_BOLD}
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
              fontWeight={FW_MED}
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

      <Expanded />
    </Box>
  );
};

export default TargetDesc;
