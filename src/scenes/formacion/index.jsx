import { Box, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import TargetDesc from "../../components/targets/TargetDesc";

import { ParticipantesData } from "../../utils/ParticipantesData";

const COLS = {
  niveles: "experience",
  grado: "grado_final",
  titulo: "Título",
  programa: "programa_categorias",
};

const nivelDescById = {
  novel: "Formadores que tienen hasta 5 años de experiencia en el rol.",
  intermedio: "Formadores que tienen hasta 11 años de experiencia en el rol.",
  experto: "Formadores que tienen más de 12 años de experiencia en el rol.",
};

const norm = (x) => String(x ?? "").trim().toLowerCase();

const PROGRAM_KEYS = [
  { id: "educacion_parvularia", label: "Educación en Párvularia" },
  { id: "educacion_basica", label: "Educación en Básica" },
  { id: "educacion_media", label: "Educación en Media" },
  { id: "formacion_pedagogica", label: "Formación pedagógica" },
  { id: "postgrado", label: "Postgrado" },
  { id: "otras_carreras", label: "Otras carreras" },
];

const Formacion = () => {
  const colors = tokens();
  const { loading, frecuencyData, rawData, displayName, personKey } =
    ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;

  const safeRaw = Array.isArray(rawData) ? rawData : [];

  const uniqueNamesByValue = (columnName, valueToMatch) => {
    const target = norm(valueToMatch);
    const seen = new Set();
    const names = [];

    safeRaw.forEach((row) => {
      if (norm(row?.[columnName]) !== target) return;

      const k = personKey(row);
      if (seen.has(k)) return;

      seen.add(k);
      names.push(displayName(row));
    });

    return Array.from(new Set(names))
      .map((x) => x.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "es"));
  };

  const renderName = (name) => (
    <Box
      key={name}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom={`1px solid ${colors.primary[300]}`}
      pb="8px"
    >
      <Typography
        color={colors.primary[100]}
        fontWeight={900}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={name}
      >
        {name}
      </Typography>
    </Box>
  );

  const safeFreq = (col) => {
    const arr = typeof frecuencyData === "function" ? frecuencyData(col) : [];
    return Array.isArray(arr) ? arr : [];
  };

  const niveles = safeFreq(COLS.niveles);
  const grado = safeFreq(COLS.grado);
  const titulo = safeFreq(COLS.titulo);

  const nivelOrder = { novel: 0, intermedio: 1, experto: 2 };
  niveles.sort((a, b) => (nivelOrder[a.id] ?? 999) - (nivelOrder[b.id] ?? 999));

  const getProgramSet = (row) => {
    const arr = row?.[COLS.programa];
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map((x) => String(x ?? "").trim()).filter(Boolean));
  };

  const programasCards = PROGRAM_KEYS.map((p) => {
    const seen = new Set();
    const names = [];

    safeRaw.forEach((row) => {
      const progSet = getProgramSet(row);
      if (!progSet.has(p.id)) return;

      const k = personKey(row);
      if (seen.has(k)) return;

      seen.add(k);
      names.push(displayName(row));
    });

    const uniqueSorted = Array.from(new Set(names))
      .map((x) => x.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "es"));

    return {
      id: p.id,
      label: p.label,
      value: seen.size,
      names: uniqueSorted,
    };
  });

  const gridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(1, 1fr)",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: "20px",
    alignItems: "stretch",
  };

  const gridTituloSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(1, 1fr)",
      sm: "repeat(2, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: "20px",
    alignItems: "stretch",
  };

  return (
    <Box m="20px" ml="5px" pb="100px">
      <Header
        title="FORMACIÓN"
        subtitle="Detalle por niveles, grado, título y programas"
      />

      {/* =========================
          NIVELES
         ========================= */}
      <Box mt={2}>
        <Typography
          variant="h4"
          fontWeight={600}
          color={colors.primary[100]}
          sx={{ mb: 2 }}
        >
          NIVELES
        </Typography>

        <Box sx={gridSx}>
          {niveles.map((n) => {
            const label = String(n.label ?? n.id ?? "Nivel").trim();


            const nivelKey = norm(n.id ?? label);
            const desc = nivelDescById[nivelKey] ?? "";

           
            const names = uniqueNamesByValue(COLS.niveles, nivelKey);

            return (
              <TargetDesc
                key={n.id ?? label}
                variant="dash"
                fullWidth
                titleWrap
                icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
                bgColor={colors.primary[200]}
                sx={{ minHeight: 84, borderRadius: "18px" }}
                renderItem={(item) => renderName(item)}
                expandedDivider={true}
                expandedPaddingTop={12}
                title={label}
                value={n.value ?? 0}
                valueLabel="personas"
                description={desc} 
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* =========================
          GRADO
         ========================= */}
      <Box mt={4}>
        <Typography
          variant="h4"
          fontWeight={600}
          color={colors.primary[100]}
          sx={{ mb: 2 }}
        >
          GRADO
        </Typography>

        <Box sx={gridSx}>
          {grado.map((g) => {
            const label = String(g.label ?? g.id ?? "Grado").trim();
            const names = uniqueNamesByValue(COLS.grado, g.id ?? label);

            return (
              <TargetDesc
                key={g.id}
                variant="dash"
                titleWrap
                fullWidth
                icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
                bgColor={colors.primary[200]}
                sx={{ minHeight: 84, borderRadius: "18px" }}
                renderItem={(item) => renderName(item)}
                expandedDivider={true}
                expandedPaddingTop={12}
                title={label}
                value={g.value ?? 0}
                valueLabel="personas"
                description="" 
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* =========================
          TÍTULO
         ========================= */}
      <Box mt={4}>
        <Typography
          variant="h4"
          fontWeight={600}
          color={colors.primary[100]}
          sx={{ mb: 2 }}
        >
          TÍTULO PROFESIONAL
        </Typography>

        <Box sx={gridTituloSx}>
          {titulo.map((t) => {
            const label = String(t.label ?? t.id ?? "Título").trim();
            const names = uniqueNamesByValue(COLS.titulo, t.id ?? label);

            return (
              <TargetDesc
                key={t.id}
                variant="dash"
                fullWidth
                titleWrap
                icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
                bgColor={colors.primary[200]}
                sx={{ minHeight: 84, borderRadius: "18px" }}
                renderItem={(item) => renderName(item)}
                expandedDivider={true}
                expandedPaddingTop={12}
                title={label}
                value={t.value ?? 0}
                valueLabel="personas"
                description=""     
                items={names}
              />
            );
          })}
        </Box>
      </Box>

      {/* =========================
          PROGRAMAS
         ========================= */}
      <Box mt={4}>
        <Typography
          variant="h4"
          fontWeight={600}
          color={colors.primary[100]}
          sx={{ mb: 2 }}
        >
          PROGRAMAS DONDE IMPARTEN
        </Typography>

        <Box sx={gridSx}>
          {programasCards.map((p) => (
            <TargetDesc
              key={p.id}
              variant="dash"
              fullWidth
              titleWrap
              icon={<GroupsIcon sx={{ color: colors.green[200] }} />}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
              renderItem={(item) => renderName(item)}
              expandedDivider={true}
              expandedPaddingTop={12}
              title={p.label}
              value={p.value}
              valueLabel="personas"
              description=""      
              items={p.names}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Formacion;
