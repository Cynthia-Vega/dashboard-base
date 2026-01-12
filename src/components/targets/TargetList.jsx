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

const TargetList = ({
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

  expandedDivider = true,
  expandedPaddingTop = 12,

  listPaddingX = 2,
  listPaddingBottom = 2,

  titleWrap = false,
  headerMinHeight,
  headerPaddingY,
  expandIconPosition = "br",

  items = [],
  renderItem,

  maxHeight = 260,
  gap = 10,

  fillExpanded = false,
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
    display: "flex",
    flexDirection: "column",
    height: "100%",
    ...touchSx,
    ...sx,
  };

  const titleSx = getTitleSx({ titleWrap, fontFamily, withFamily: true });

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
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        pr: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: resolvedGap,
        ...(fillExpanded ? {} : { maxHeight }),
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
    </Box>
  );

  const isHero = variant === "hero" || orientation === "vertical";

  if (isHero) {
    const iconSize = mediaSize;
    const minH = headerMinHeight ?? 240;

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
            pb: 3.5,
            minHeight: minH,
            gap: 1.0,
            flexShrink: 0,
            textAlign: "center",
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

          <ValueWithLabel
            variant="h4"
            formatted={formatted}
            valueLabel={valueLabel}
            fontFamily={fontFamily}
            fontWeight={FW_BOLD}
            color={resolvedValue}
            sx={{ mt: 0.2 }}
          />

          {!!title && (
            <Typography
              variant="h6"
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
              sx={{ fontFamily, opacity: 0.9 }}
              title={subtitle}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ flex: open ? 1 : "0 0 auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {expandedDivider && <Divider sx={{ borderColor: colors.primary[300] }} />}

            <Box
              sx={{
                px: listPaddingX,
                pb: listPaddingBottom,
                pt: `${expandedPaddingTop}px`,
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()} 
            >
              <BodyList />
            </Box>
          </Collapse>
        </Box>
      </Box>
    );
  }

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
          flexShrink: 0,
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

      <Box sx={{ flex: open ? 1 : "0 0 auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {expandedDivider && <Divider sx={{ borderColor: colors.primary[300] }} />}

          <Box
            sx={{
              px: listPaddingX,
              pb: listPaddingBottom,
              pt: `${expandedPaddingTop}px`,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <BodyList />
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default TargetList;
