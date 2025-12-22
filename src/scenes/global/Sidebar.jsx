import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

const COLLAPSED_W = 80;   // ancho del rail fijo
const EXPANDED_W = 280;   // ancho del sidebar overlay

const Item = ({ title, to, icon, selected, setSelected, onNavigate }) => {
  const colors = tokens();

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.primary[100] }}
      onClick={() => {
        setSelected(title);
        onNavigate?.();
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const colors = tokens();
  const [open, setOpen] = useState(false); // controla overlay expandido
  const [selected, setSelected] = useState("Panel de datos");

  const commonSx = {
    "& .pro-sidebar-inner": {
      background: `${colors.primary[200]} !important`,
    },
    "& .pro-icon-wrapper": {
      backgroundColor: "transparent !important",
    },
    "& .pro-inner-item": {
      padding: "5px 35px 5px 20px !important",
    },
    "& .pro-inner-item:hover": {
      color: `${colors.green[100]} !important`,
    },
    "& .pro-menu-item.active": {
      color: `${colors.green[200]} !important`,
    },
  };

  const MenuContent = ({ collapsed }) => (
    <Menu iconShape="square">
      {/* TOP: botón menú */}
      <MenuItem
        // En colapsado: abre overlay. En expandido: también puede cerrar si clickeas el header
        onClick={() => setOpen((v) => !v)}
        // ✅ SOLO mostrar icono izquierdo cuando está colapsado (para evitar doble botón)
        icon={collapsed ? <MenuOutlinedIcon /> : null}
        style={{
          margin: "10px 0 20px 0",
          color: colors.green[200],
        }}
      >
        {/* ✅ En expandido mostramos "ADMIN" + botón a la derecha */}
        {!collapsed && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            ml="15px"
            pr="10px"
          >
            <Typography variant="h3" color={colors.primary[100]}>
              ADMIN
            </Typography>

            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // evita doble toggle
                setOpen(false);
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        )}
      </MenuItem>

      {/* LOGO SOLO EN EXPANDIDO */}
      {!collapsed && (
        <Box mb="25px">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              alt="logo"
              width="150px"
              height="auto"
              src="/assets/logo.png"
              style={{ display: "block" }}
            />
          </Box>
        </Box>
      )}

      {/* Items */}
      <Box paddingLeft={collapsed ? undefined : "10%"}>
        <Item
          title="Panel de datos"
          to="/"
          icon={
            collapsed ? (
              <img
                alt="Panel de datos"
                src="/assets/logo.png"
                style={{ width: 30, height: 30, borderRadius: "20%" }}
              />
            ) : (
              <HomeOutlinedIcon />
            )
          }
          selected={selected}
          setSelected={setSelected}
          // cuando navegas desde overlay, cerrarlo
          onNavigate={() => setOpen(false)}
        />

        <Typography
          variant="h6"
          color={colors.green[200]}
          fontWeight="bold"
          sx={{ m: "15px 0 5px 20px" }}
        >
          Data
        </Typography>

        <Item
          title="Participantes"
          to="/participantes"
          icon={<PeopleOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
          onNavigate={() => setOpen(false)}
        />

        <Item
          title="Universidades"
          to="/universidades"
          icon={<AccountBalanceOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
          onNavigate={() => setOpen(false)}
        />

        <Item
          title="Eventos"
          to="/eventos"
          icon={<CalendarMonthOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
          onNavigate={() => setOpen(false)}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          color={colors.green[200]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          Charts
        </Typography>

        <Item
          title="Line Chart"
          to="/line"
          icon={<TimelineOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
          onNavigate={() => setOpen(false)}
        />

        <Item
          title="Geography Chart"
          to="/geography"
          icon={<MapOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
          onNavigate={() => setOpen(false)}
        />
      </Box>
    </Menu>
  );

  return (
    <>
      {/* ✅ RAIL fijo (colapsado) */}
      <Box
        sx={{
          width: COLLAPSED_W,
          flexShrink: 0,
          ...commonSx,
          "& .pro-sidebar": {
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            width: `${COLLAPSED_W}px`,
            zIndex: 1100,
          },
        }}
      >
        <ProSidebar collapsed>
          <MenuContent collapsed />
        </ProSidebar>
      </Box>

      {/* ✅ OVERLAY (expandido) */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 1200,
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              width: EXPANDED_W,
              ...commonSx,
              "& .pro-sidebar": {
                height: "100vh",
                width: `${EXPANDED_W}px`,
              },
            }}
          >
            <ProSidebar collapsed={false}>
              <MenuContent collapsed={false} />
            </ProSidebar>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
