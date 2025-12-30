// src/scenes/geography/index.jsx
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import TargetMet from "../../components/targets/TargetMet";
import { ParticipantesData } from "../../utils/ParticipantesData";
import { geoFeatures } from "../../data/mockGeoFeatures";

const Regiones = () => {
  const colors = tokens();

  const { loading, frecuencyData, regionStats } = ParticipantesData();

  const regionNameById = useMemo(() => {
    return Object.fromEntries(
      (geoFeatures?.features ?? []).map((f) => [
        String(f?.properties?.codregion),
        f?.properties?.Region,
      ])
    );
  }, []);

 
  const mapData = useMemo(() => {
    const arr = typeof frecuencyData === "function" ? frecuencyData("region_id") : [];
    return Array.isArray(arr) ? arr : [];
  }, [frecuencyData]);

  const statsByRegionId = useMemo(() => {
    return typeof regionStats === "function" ? regionStats() : {};
  }, [regionStats]);


  const regionesLista = useMemo(() => {
    const REGION_ORDER_N2S = [15, 1, 2, 3, 4, 5, 13, 6, 7, 16, 8, 9, 14, 10, 11, 12];
    const REGION_RANK = Object.fromEntries(REGION_ORDER_N2S.map((id, i) => [id, i]));

    const safe = Array.isArray(mapData) ? mapData : [];

    const mapped = safe.map((r) => {
      const ridRaw = String(r.id ?? "");
      const idNum = Number.parseInt(ridRaw, 10);

      const name = regionNameById[ridRaw] ?? r.label ?? `Región ${ridRaw}`;

      const stats = statsByRegionId[ridRaw] ?? {
        participantes: r.value ?? 0,
        universidades: 0,
        carreras: 0,
        programas: 0,
      };

      const rank = Number.isFinite(idNum) && REGION_RANK[idNum] != null ? REGION_RANK[idNum] : 999;

      return { id: ridRaw, idNum, rank, name, stats };
    });

    // orden geográfico
    mapped.sort((a, b) => (a.rank - b.rank) || ((a.idNum ?? 999) - (b.idNum ?? 999)));

    return mapped;
  }, [mapData, regionNameById, statsByRegionId]);



  if (loading) return <div>Cargando datos…</div>;

  return (
    <Box m="20px">
      <Header title="REGIONES" subtitle="Detalle por región" />

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
          // border="1px solid red"
          sx={{justifySelf:'center', width: '400px', height: '1450px' }}
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

        {/* DETALLE */}
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
              <TargetMet
                key={r.id}
                title={r.name}
                variant="dash"
                fullWidth
                bgColor={colors.primary[200]}
                sx={{ borderRadius: "18px" }}
                titleWrap
                headerMinHeight={84}
                headerPaddingY={2}
                stats={[
                  { label: "Participantes", value: r.stats.participantes },
                  { label: "Universidades", value: r.stats.universidades },
                  { label: "Carreras", value: r.stats.carreras },
                  { label: "Programas", value: r.stats.programas },
                ]}
                columns={2}
              />


            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Regiones;
