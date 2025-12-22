// src/scenes/geography/index.jsx
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import Target from "../../components/Target";
import { ParticipantesData } from "../../data/ParticipantesData";
import { geoFeatures } from "../../data/mockGeoFeatures";

const Geography = () => {
  const colors = tokens();

  // ✅ ahora pedimos el helper
  const { loading, frecuencyData, regionStats } = ParticipantesData();

  // ✅ Hooks SIEMPRE arriba
  const regionNameById = useMemo(() => {
    return Object.fromEntries(
      (geoFeatures?.features ?? []).map((f) => [
        String(f?.properties?.codregion),
        f?.properties?.Region,
      ])
    );
  }, []);

  // ✅ mapa
  const mapData = useMemo(() => {
    const arr = typeof frecuencyData === "function" ? frecuencyData("region_id") : [];
    return Array.isArray(arr) ? arr : [];
  }, [frecuencyData]);

  // ✅ stats por región desde ParticipantesData
  const statsByRegionId = useMemo(() => {
    return typeof regionStats === "function" ? regionStats() : {};
  }, [regionStats]);

  // ✅ lista para el panel derecho (ordenada por participantes)
  const regionesLista = useMemo(() => {
    const safe = Array.isArray(mapData) ? mapData : [];

    const mapped = safe.map((r) => {
      const rid = String(r.id ?? "");
      const name = regionNameById[rid] ?? r.label ?? `Región ${rid}`;
      const stats = statsByRegionId[rid] ?? {
        participantes: r.value ?? 0,
        universidades: 0,
        carreras: 0,
        programas: 0,
      };

      return { id: rid, name, stats };
    });

    mapped.sort((a, b) => (b.stats.participantes ?? 0) - (a.stats.participantes ?? 0));
    return mapped;
  }, [mapData, regionNameById, statsByRegionId]);

  // ✅ return condicional después de hooks
  if (loading) return <div>Cargando datos…</div>;

  return (
    <Box m="20px">
      <Header title="REGIONES" subtitle="Detalle por región con indicadores" />

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(180px, auto)"
        gap="20px"
      >
        {/* MAPA */}
        <Box
          gridColumn={{ xs: "span 12", md: "span 6" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="15px"
          display="flex"
          flexDirection="column"
          border="1px solid red"
          sx={{ width: '400px', height: '1450px' }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
            color={colors.primary[100]}
          >
            Distribución por región
          </Typography>

          <Box flex="1" minHeight="360px">
            <GeographyChart data={mapData} />
          </Box>
        </Box>

        {/* SCROLL DERECHA: Targets desplegables */}
        <Box
          gridColumn={{ xs: "span 12", md: "span 6" }}
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          display="flex"
          flexDirection="column"
          sx={{ minWidth: 0 }}
        >
          <Box p="15px">
            <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
              Regiones
            </Typography>
          </Box>

          <Box
            flex="1"
            overflow="auto"
            sx={{
              px: 2,
              pb: 2,
              pr: 3,
              pt: 0
            }}

            display="flex"
            flexDirection="column"
            gap="14px"
          >
            {regionesLista.map((r) => (
              <Target
                key={r.id}
                title={r.name}
                variant="dash"
                fullWidth
                expandable
                hideValue        // ✅ sin número
                headerOnly       // ✅ header “tipo lista”
                titleWrap        // ✅ 2 líneas si es largo
                headerMinHeight={84}
                headerPaddingY={2}
                bgColor={colors.primary[200]}
                sx={{ borderRadius: "18px" }}
              >
                <Target.BodyStats
                  colors={colors}
                  columns={2}
                  stats={[
                    { label: "Participantes", value: r.stats.participantes },
                    { label: "Universidades", value: r.stats.universidades },
                    { label: "Carreras", value: r.stats.carreras },
                    { label: "Programas", value: r.stats.programas },
                    
                  ]}
                />
              </Target>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Geography;
