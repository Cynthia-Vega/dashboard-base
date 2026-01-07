import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

  stats = [],
  columns = 2,

  detailMode = "both", // collapse, modal, both, none

  allDetailsTitle = "Detalle",
  allDetailsTooltip = "Ver detalle (todo)",
  modalMaxWidth = 560,
}) => {
  const colors = tokens();
  const theme = useTheme();

  const fontFamily = theme.typography?.fontFamily || "inherit";
  const FW_BOLD = theme.typography?.fontWeightBold ?? 700;
  const FW_MED = theme.typography?.fontWeightMedium ?? 600;
  const FW_REG = theme.typography?.fontWeightRegular ?? 400;

  const [open, setOpen] = useState(defaultExpanded);
  const [activeKey, setActiveKey] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const hasCollapse = detailMode === "collapse" || detailMode === "both";
  const hasModal = detailMode === "modal" || detailMode === "both";

  const resolvedBg = bgColor ?? colors.primary[200];
  const resolvedBorder = borderColor ?? "rgba(0,0,0,0.10)";
  const resolvedTitle = titleColor ?? colors.primary[100];

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      if (!next) setActiveKey(null);
      return next;
    });
  };

  const cardSx = {
    fontFamily,
    "&, & *": { fontFamily },
    "& .MuiTypography-root": { fontFamily },
    "& .MuiListItemText-primary, & .MuiListItemText-secondary": { fontFamily },

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

  const normalizeItems = (items) => {
    if (!items) return [];
    if (!Array.isArray(items)) return [String(items)];
    return items
      .map((it) => {
        if (it == null) return "";
        if (typeof it === "string" || typeof it === "number") return String(it);
        if (typeof it === "object") {
          if ("label" in it && "value" in it) return `${it.label}: ${it.value}`;
          if ("label" in it) return String(it.label);
          return JSON.stringify(it);
        }
        return String(it);
      })
      .filter(Boolean);
  };

  const activeStat = useMemo(() => {
    if (!activeKey) return null;
    return (
      stats.find((s, idx) => (s.key ?? `${s.label}-${idx}`) === activeKey) ?? null
    );
  }, [activeKey, stats]);

  const handleStatClick = (s, idx, e) => {
    e.stopPropagation();
    const key = s.key ?? `${s.label}-${idx}`;

    if (detailMode === "modal") {
      setModalOpen(true);
      return;
    }
    if (!hasCollapse) return;

    setActiveKey((prev) => (prev === key ? null : key));
  };

  const AllDetailsButton = () => {
    if (!hasModal) return null;

    return (
      <Tooltip title={allDetailsTooltip}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 3,
            width: 36,
            height: 36,
            border: `1px solid ${resolvedBorder}`,
            backgroundColor: "rgba(255,255,255,0.70)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.90)" },
            color: colors.primary[100],
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  const ExpandIcon = () => (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      sx={{
        position: "absolute",
        right: 10,
        top: 54,
        zIndex: 2,
        width: 36,
        height: 36,
        border: `1px solid ${resolvedBorder}`,
        backgroundColor: "rgba(255,255,255,0.70)",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.90)" },
        color: colors.primary[100],
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .2s ease",
      }}
    >
      <ExpandMoreIcon />
    </IconButton>
  );

  const StatBox = ({ s, idx }) => {
    const key = s.key ?? `${s.label}-${idx}`;
    const isActive = key === activeKey;
    const hasItems = normalizeItems(s.items).length > 0;

    return (
      <Box
        key={key}
        role={hasCollapse || detailMode === "modal" ? "button" : undefined}
        tabIndex={hasCollapse || detailMode === "modal" ? 0 : -1}
        onClick={(e) => handleStatClick(s, idx, e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleStatClick(s, idx, e);
        }}
        sx={{
          backgroundColor: colors?.primary?.[300] ?? "rgba(0,0,0,0.06)",
          borderRadius: "10px",
          p: "10px 12px",
          border: `1px solid ${
            isActive
              ? (colors?.green?.[200] ?? "rgba(0,0,0,0.25)")
              : (colors?.primary?.[200] ?? "rgba(0,0,0,0.08)")
          }`,
          cursor: hasCollapse || detailMode === "modal" ? "pointer" : "default",
          outline: "none",
          transition:
            "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
          "&:hover": {
            transform:
              hasCollapse || detailMode === "modal" ? "translateY(-1px)" : "none",
            boxShadow:
              hasCollapse || detailMode === "modal"
                ? "0 10px 18px rgba(0,0,0,0.10)"
                : "none",
          },
        }}
      >
        <Typography
          variant="caption"
          fontWeight={FW_BOLD}
          color={colors?.primary?.[100] ?? "inherit"}
          sx={{ opacity: 0.9 }}
        >
          {s.label}
        </Typography>

        <Typography
          variant="h6"
          fontWeight={FW_BOLD}
          color={colors?.green?.[200] ?? "inherit"}
          sx={{ lineHeight: 1.1 }}
        >
          {typeof s.value === "number" ? s.value.toLocaleString("es-CL") : s.value}
        </Typography>

        {(hasCollapse || detailMode === "modal") && (
          <Typography
            variant="caption"
            sx={{ opacity: 0.75, display: "block", mt: 0.4, fontWeight: FW_REG }}
          >
            {detailMode === "modal"
              ? "Ver detalle"
              : hasItems
              ? isActive
                ? "Ocultar lista"
                : "Ver lista"
              : "Sin datos"}
          </Typography>
        )}
      </Box>
    );
  };

  const BodyStats = () => (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${columns}, minmax(0, 1fr))`}
        gap="10px"
      >
        {stats.map((s, i) => (
          <StatBox key={s.key ?? `${s.label}-${i}`} s={s} idx={i} />
        ))}
      </Box>

      {hasCollapse && (
        <Collapse in={!!activeStat} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1.4 }}>
            <Divider sx={{ borderColor: colors.primary[300], my: 1 }} />

            <Typography
              variant="body2"
              fontWeight={FW_BOLD}
              color={colors.primary[100]}
              sx={{ mb: 0.8 }}
            >
              {activeStat?.label}
            </Typography>

            <Box
              sx={{
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.55)",
                overflow: "hidden",
              }}
            >
              <Box sx={{ maxHeight: 220, overflowY: "auto" }}>
                <List dense sx={{ py: 0 }}>
                  {normalizeItems(activeStat?.items).length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="Sin datos"
                        primaryTypographyProps={{
                          sx: { opacity: 0.8, fontWeight: FW_REG },
                        }}
                      />
                    </ListItem>
                  ) : (
                    normalizeItems(activeStat?.items).map((txt, idx) => (
                      <ListItem
                        key={`${activeKey}-item-${idx}`}
                        sx={{
                          py: 0.6,
                          borderBottom:
                            idx === normalizeItems(activeStat?.items).length - 1
                              ? "none"
                              : `1px solid ${colors.primary[300]}`,
                        }}
                      >
                        <ListItemText
                          primary={txt}
                          primaryTypographyProps={{
                            sx: { fontSize: 13, opacity: 0.92, fontWeight: FW_BOLD },
                          }}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </Box>
          </Box>
        </Collapse>
      )}
    </Box>
  );

  const DetailsModal = () => (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      PaperProps={{
        sx: {
          fontFamily,
          "&, & *": { fontFamily },
          "& .MuiTypography-root": { fontFamily },
          "& .MuiListItemText-primary, & .MuiListItemText-secondary": { fontFamily },

          borderRadius: 2,
          width: "92vw",
          maxWidth: `${modalMaxWidth}px`,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: FW_BOLD }}>
        {allDetailsTitle}
      </DialogTitle>

      <DialogContent sx={{ pt: 1, maxHeight: "70vh", overflowY: "auto" }}>
        {stats.map((s, i) => {
          const key = s.key ?? `${s.label}-${i}`;
          const items = normalizeItems(s.items);

          return (
            <Box key={`modal-${key}`} sx={{ mb: 1.8 }}>
              <Typography
                variant="body2"
                fontWeight={FW_BOLD}
                sx={{ mb: 0.6, color: colors.primary[100] }}
              >
                {s.label}
              </Typography>

              <Box
                sx={{
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.55)",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ maxHeight: 220, overflowY: "auto" }}>
                  <List dense sx={{ py: 0 }}>
                    {items.length === 0 ? (
                      <ListItem>
                        <ListItemText
                          primary="Sin datos"
                          primaryTypographyProps={{
                            sx: { opacity: 0.8, fontWeight: FW_REG },
                          }}
                        />
                      </ListItem>
                    ) : (
                      items.map((txt, idx) => (
                        <ListItem
                          key={`modal-${key}-item-${idx}`}
                          sx={{
                            py: 0.6,
                            borderBottom:
                              idx === items.length - 1
                                ? "none"
                                : `1px solid ${colors.primary[300]}`,
                          }}
                        >
                          <ListItemText
                            primary={txt}
                            primaryTypographyProps={{
                              sx: { fontSize: 13, opacity: 0.92, fontWeight: FW_BOLD },
                            }}
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Box>
              </Box>
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );

  /* =============================
     VERTICAL / HERO
     ============================= */
  if (orientation === "vertical" || variant === "hero") {
    return (
      <>
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
            <AllDetailsButton />
            <ExpandIcon />

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

        {hasModal && <DetailsModal />}
      </>
    );
  }

  /* =============================
     HORIZONTAL / DASH
     ============================= */
  const py = headerPaddingY ?? 2.2;
  const minH = Math.max(headerMinHeight ?? 0, 95);

  return (
    <>
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
            pr: 8,
          }}
        >
          <AllDetailsButton />
          <ExpandIcon />

          <Box sx={{ minWidth: 0, flex: 1 }}>
            {!!title && (
              <Typography
                variant="h6"
                fontWeight={FW_BOLD}
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

      {hasModal && <DetailsModal />}
    </>
  );
};

export default TargetMet;
