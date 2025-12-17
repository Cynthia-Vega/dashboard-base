import { Box } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Target from "../../components/Target";
import SchoolIcon from "@mui/icons-material/School";
import { ParticipantesData } from "../../data/ParticipantesData";

// ✅ Mapa: nombre exacto -> carpeta abreviación + archivo
const UNI_IMG = {
  "Pontificia Universidad Católica de Chile": { folder: "PUC", file: "1.png" },
  "Pontificia Universidad Católica de Valparaíso": { folder: "PUCV", file: "1.png" },
  "Universidad Alberto Hurtado": { folder: "UAH", file: "1.png" },
  "Universidad Andrés Bello": { folder: "UNAB", file: "1.png" },
  "Universidad Arturo Prat": { folder: "UNAP", file: "1.png" },
  "Universidad Austral de Chile": { folder: "UACH", file: "1.png" },
  "Universidad Bernardo O'Higgins": { folder: "UBO", file: "1.png" },
  "Universidad Católica de la Santísima Concepción": { folder: "UCSC", file: "1.png" },
  "Universidad Católica de Temuco": { folder: "UCT", file: "1.png" },
  "Universidad Católica del Maule": { folder: "UCM", file: "1.png" },
  "Universidad Católica del Norte": { folder: "UCN", file: "1.png" },
  "Universidad Católica Silva Henríquez": { folder: "UCSH", file: "1.png" },
  "Universidad de Atacama": { folder: "UDA", file: "1.png" },
  "Universidad de Chile": { folder: "UCH", file: "1.png" },
  "Universidad de Concepción": { folder: "UDEC", file: "1.png" },
  "Universidad de La Frontera": { folder: "UFRO", file: "1.png" },
  "Universidad de La Serena": { folder: "USERENA", file: "1.png" },
  "Universidad de Las Américas": { folder: "UDLA", file: "1.png" },
  "Universidad del Bío-Bío": { folder: "UBB", file: "1.png" },
  "Universidad del Desarrollo": { folder: "UDD", file: "1.png" },
  "Universidad Diego Portales": { folder: "UDP", file: "1.png" },
  "Universidad de los Andes": { folder: "UANDES", file: "1.png" },
  "Universidad de los Lagos": { folder: "ULA", file: "1.png" },
  "Universidad de Magallanes": { folder: "UMAG", file: "1.png" },
  "Universidad de O'Higgins": { folder: "UOH", file: "1.png" },
  "Universidad de Playa Ancha": { folder: "UPLA", file: "1.png" },
  "Universidad de Santiago de Chile": { folder: "USACH", file: "1.png" },
  "Universidad de Talca": { folder: "UTALCA", file: "1.png" },
  "Universidad de Tarapacá": { folder: "UTA", file: "1.png" },
  "Universidad Finis Terrae": { folder: "UFT", file: "1.png" },
  "Universidad Metropolitana de Ciencias de la Educación": { folder: "UMCE", file: "1.png" },
  "Universidad San Sebastián": { folder: "USS", file: "1.png" },
  "Universidad Santo Tomás": { folder: "UST", file: "1.png" },
};

// ✅ Resolver imagen (Vite-friendly)
function getUniImgSrc(universityName) {
  const ref = UNI_IMG[universityName];
  if (!ref) return null;

  // ✅ como está en /public, se accede directo desde la raíz
  return `/assets/universities/${ref.folder}/${ref.file}`;
}

const Universidades = () => {
  const colors = tokens();
  const { loading, frecuencyData } = ParticipantesData();
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
          const name = u.label || u.id || "Universidad";
          const imgSrc = getUniImgSrc(name);

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
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Universidades;
