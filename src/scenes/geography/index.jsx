import { Box, Typography } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { ParticipantesData } from "../../data/ParticipantesData";
import { geoFeatures } from "../../data/mockGeoFeatures";

const Geography = () => {
  const { loading, frecuencyData } = ParticipantesData();
  const colors = tokens();

  if (loading) return <div>Cargando datos…</div>;

  const totalPorRegion = frecuencyData("region_id"); // [{id,label,value}]
  const safe = Array.isArray(totalPorRegion) ? totalPorRegion : [];

  // ✅ mapa id -> nombre región usando geoFeatures
  const regionNameById = Object.fromEntries(
    geoFeatures.features.map((f) => [
      String(f.properties.codregion),
      f.properties.Region, // ajusta si en tu geojson se llama distinto
    ])
  );

  // ✅ lista para el panel derecho
  const list = [...safe]
    .map((d) => ({
      id: String(d.id),
      name: regionNameById[String(d.id)] ?? d.label ?? `Región ${d.id}`,
      value: d.value ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Box m="20px" pb="60px">
      <Header title="Geography" subtitle="Wolas, aquí puedes ver el gráfico geográfico" />

      <Box
        mt={2}
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap="20px"
        alignItems="stretch"
      >
        {/* MAPA */}
        <Box
          height={{ xs: "70vh", md: "80vh" }}
          border={`1px solid ${colors.primary[200]}`}
          borderRadius="18px"
          backgroundColor={colors.primary[200]}
          overflow="hidden"
        >
          <GeographyChart data={safe} isDashboard={false} height="100%" />
        </Box>

        {/* PANEL DERECHO (SCROLL) */}
        <Box
          border={`1px solid ${colors.primary[200]}`}
          borderRadius="18px"
          backgroundColor={colors.primary[200]}
          p={2}
          display="flex"
          flexDirection="column"
          minHeight={{ xs: "260px", md: "80vh" }}
        >
          <Typography
            variant="h4"
            fontWeight={900}
            color={colors.primary[100]}
            sx={{ mb: 1 }}
          >
            Regiones
          </Typography>

          <Box
            sx={{
              overflowY: "auto",
              pr: 1,
              flex: 1,
              // ✅ scrollbar bonita (Chrome/Edge)
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.25)",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.06)",
                borderRadius: "8px",
              },
            }}
          >
            {list.map((r) => (
              <Box
                key={r.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: "10px 12px",
                  mb: 1,
                  borderRadius: "14px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  color={colors.primary[100]}
                  fontWeight={800}
                  sx={{
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={r.name}
                >
                  {r.name}
                </Typography>

                <Box
                  sx={{
                    minWidth: 44,
                    textAlign: "center",
                    px: 1.2,
                    py: 0.5,
                    borderRadius: "999px",
                    backgroundColor: colors.green[200],
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography color={colors.primary[100]} fontWeight={900}>
                    {r.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Geography;
