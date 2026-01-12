import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { ParticipantesData } from "../../utils/ParticipantesData";
import TargetDesc from "../../components/targets/TargetDesc";

const Universidades = () => {
  const colors = tokens();
  const { loading, frecuencyData, universityImage, rawData, displayName } =
    ParticipantesData();
  if (loading) return <div>Cargando datos…</div>;

  const universidadesData = frecuencyData("nombre_universidad");

  const sorted = [...universidadesData].sort(
    (a, b) => (b.value ?? 0) - (a.value ?? 0)
  );

  return (
    <Box m="20px" ml="5px" pb="100px">
      <Header
        title="UNIVERSIDADES"
        subtitle="Distribución de formadores por universidad"
      />

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap="20px"
        mt={2}
      >
        {sorted.map((u) => {
          const uniName = (u.label || u.id || "Universidad").trim();
          const imgSrc = universityImage(uniName);

          const participants = (rawData || []).filter(
            (row) => String(row?.nombre_universidad ?? "").trim() === uniName
          );

          return (
            <TargetDesc
              key={u.id}
              variant="hero"
              fullWidth
              titleWrap
              title={uniName}
              value={u.value ?? 0}
              imgSrc={imgSrc}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
              mediaSize={150}
              imgFit="contain"
              imgRound={false}
              valueLabel="formadores/as"
              description=""     
              items={participants}
              maxHeight={260}
              gap={0}
              renderItem={(p, i) => {
                const nameShown = displayName(p);
                const key = `${uniName}-${p?.rut ?? p?.username ?? i}`;

                return (
                  <Box
                    key={key}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`1px solid ${colors.primary[300]}`}
                    pb="8px"
                  >
                    <Typography
                      color={colors.primary[100]}
                      fontWeight={800}
                      sx={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={nameShown}
                    >
                      {nameShown}
                    </Typography>

                    <Typography
                      color={colors.green[200]}
                      fontWeight={900}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {p?.region ? p.region : ""}
                    </Typography>
                  </Box>
                );
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Universidades;
