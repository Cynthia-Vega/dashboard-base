import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import TargetDesc from "../../components/targets/TargetDesc";
import { tokens } from "../../theme";

import GroupsIcon from "@mui/icons-material/Groups";
import VideocamIcon from "@mui/icons-material/Videocam";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HandymanIcon from "@mui/icons-material/Handyman";

import { ParticipantesData, getParticipantsList } from "../../utils/ParticipantesData";
import {
  ENCUENTROS_CONFIG,
  PRESENTACIONES_CONFIG,
  REUNIONES_CONFIG,
  TALLERES_2025_CONFIG,
  TALLERES_2024_CONFIG,
  TALLERES_2023_CONFIG,
  WEBINARS_CONFIG,
} from "../../data/EventsData";


const iconByKey = (key, colors) => {
  const sx = { color: colors.green[200] };
  if (key === "videocam") return <VideocamIcon sx={sx} />;
  if (key === "eventNote") return <EventNoteIcon sx={sx} />;
  if (key === "handyman") return <HandymanIcon sx={sx} />;
  return <GroupsIcon sx={sx} />;
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
  gap: "20px",
  mt: 1.5,
};

const titleSlot = (colors, text) => (
  <Box sx={{ height: 48, display: "flex", alignItems: "center" }}>
    <Typography variant="h4" fontWeight={600} color={colors.primary[100]} sx={{ m: 0 }}>
      {text}
    </Typography>
  </Box>
);

const renderName = (colors) => (name) => (
  <Typography sx={{ fontWeight: 900, fontSize: "13.5px", color: colors.primary[100] }}>
    {name}
  </Typography>
);

const commonTargetProps = (colors) => ({
  variant: "dash",
  fullWidth: true,
  bgColor: colors.primary[200],
  sx: { minHeight: 84, borderRadius: "18px" },
  maxHeight: 260,
  renderItem: renderName(colors),
  expandedDivider: false,
  expandedPaddingTop: 0,
});


function EventsSection({ section, byEvent, usersEvents, colors }) {

  if (Array.isArray(section.cards)) {
    return (
      <Box mt={4}>
        {titleSlot(colors, section.title)}
        <Box sx={gridSx}>
          {section.cards.map((c) => {
            const names = getParticipantsList(usersEvents, c.col);
            return (
              <TargetDesc
                key={c.col}
                {...commonTargetProps(colors)}
                title={c.title}
                value={names.length}
                valueLabel={section.valueLabel}
                icon={iconByKey(section.iconKey, colors)}
                description=""
                items={names}
              />
            );
          })}
        </Box>
      </Box>
    );
  }


  const list = (byEvent || []).filter((e) => (section.filter ? section.filter(e.id) : true));
  if (section.sort) list.sort(section.sort);

  return (
    <Box mt={4}>
      {titleSlot(colors, section.title)}
      <Box sx={gridSx}>
        {list.map((ev) => {
          const id = String(ev.id);
          const meta = section.meta?.[id] || {};
          const names = getParticipantsList(usersEvents, id);

          return (
            <TargetDesc
              key={id}
              {...commonTargetProps(colors)}
              title={meta.title ?? String(ev.label ?? ev.id ?? "")}
              descriptionTitle={meta.subtitle ?? ""}
              formadores={meta.relatores ?? ""}
              value={ev.value ?? 0}
              valueLabel={section.valueLabel}
              icon={iconByKey(section.iconKey, colors)}
              description={meta.desc ?? ""}
              items={names}
            />
          );
        })}
      </Box>
    </Box>
  );
}



export default function Eventos() {
  const colors = tokens();
  const { loading, eventsData, usersEvents } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;
  if (!eventsData) return <div>Falta eventsData().</div>;

  const { byEvent } = eventsData();


  const PRESENTACIONES_SECTION = {
    title: "PRESENTACIONES",
    iconKey: "groups",
    valueLabel: "personas",
    cards: PRESENTACIONES_CONFIG,
  };

  return (
    <Box m="20px" pb="100px">
      <Header title="EVENTOS" subtitle="Participación por instancia" />


      <EventsSection section={ENCUENTROS_CONFIG} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />

      <EventsSection section={PRESENTACIONES_SECTION} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />

      <EventsSection section={REUNIONES_CONFIG} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />

      <EventsSection section={TALLERES_2025_CONFIG} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />
      <EventsSection section={TALLERES_2024_CONFIG} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />
      <EventsSection section={TALLERES_2023_CONFIG} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />

      <EventsSection section={WEBINARS_CONFIG} byEvent={byEvent} usersEvents={usersEvents} colors={colors} />
    </Box>
  );
}
