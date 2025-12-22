import { Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Target from "../../components/Target";
import { ParticipantesData } from "../../data/ParticipantesData";

const Universidades = () => {
  const colors = tokens();
  const { loading, frecuencyData, universityImage, rawData } = ParticipantesData();
  if (loading) return <div>Cargando datos…</div>;

  const universidadesData = frecuencyData("nombre_universidad");

  const sorted = [...universidadesData].sort(
    (a, b) => (b.value ?? 0) - (a.value ?? 0)
  );

  return (
    <Box m="20px" pb="100px">
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
          const name = (u.label || u.id || "Universidad").trim();
          const imgSrc = universityImage(name);

          const participants = (rawData || []).filter(
            (row) => String(row?.nombre_universidad ?? "").trim() === name
          );

          const displayName = (row) =>
            String(row?.["Indique su nombre y apellido"] ?? "").trim() ||
            row?.username ||
            row?.rut ||
            "Sin nombre";

          return (
            <Target
              key={u.id}
              variant="hero"
              fullWidth
              title={name}
              value={u.value ?? 0}
              imgSrc={imgSrc}
              bgColor={colors.primary[200]}
              sx={{ minHeight: 84, borderRadius: "18px" }}
              mediaSize={150}
              imgFit="contain"
              imgRound={false}
              valueLabel="formadores/as"
              expandable
            >
              <Box
                sx={{
                  maxHeight: 260,
                  overflow: "auto",
                  pr: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {participants.map((p, i) => {
                  const nameShown = displayName(p);

                  return (
                    <Box
                      key={`${name}-${p?.rut ?? p?.username ?? i}`}
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

                      {/* opcional derecha */}
                      <Typography
                        color={colors.green[200]}
                        fontWeight={900}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {p?.region ? p.region : ""}
                      </Typography>
                    </Box>
                  );
                })}

                {!participants.length && (
                  <Typography color={colors.primary[100]} sx={{ opacity: 0.8 }}>
                    No hay participantes asociados.
                  </Typography>
                )}
              </Box>
            </Target>
          );
        })}
      </Box>
    </Box>
  );
};

export default Universidades;
