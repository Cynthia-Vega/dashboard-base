import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { ParticipantesData } from "../../data/ParticipantesData";

import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const isMarked = (v) => {
  if (v === null || v === undefined) return false;
  if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
  if (typeof v === "boolean") return v;
  const s = String(v).trim().toLowerCase();
  if (!s) return false;
  return ["1", "x", "si", "sí", "true", "ok", "✔"].includes(s);
};

const getNivel = (years) => {
  const y = Number(years);
  if (Number.isNaN(y)) return null;
  if (y >= 0 && y <= 5) return "novel";
  if (y >= 6 && y <= 11) return "intermedio";
  return "experto";
};

const TablaParticipantes = () => {
  const colors = tokens();
  const { loading, rawData } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;

  const cols = rawData?.length ? Object.keys(rawData[0]) : [];

  // Detecta columnas de eventos por nombre
  const tallerCols = cols.filter((c) => /^taller/i.test(c));
  const reunionCols = cols.filter((c) => /^reuni[oó]n/i.test(c));
  const encuentroCols = cols.filter((c) => /encuentro/i.test(c));
  const lanzamientoCols = cols.filter((c) => /lanzamiento/i.test(c));

  const rows = (rawData ?? []).map((r, idx) => {
    const countInCols = (arr) =>
      arr.reduce((acc, c) => acc + (isMarked(r[c]) ? 1 : 0), 0);

    return {
      id: r.ID ?? r.id ?? idx,
      nombre: r["Indique su nombre y apellido"] ?? "",
      grado: r.grado_final ?? r["Grado académico"] ?? "",
      anio_union: r["¿En qué año te uniste a RedFID? "] ?? r.anio_union ?? "",
      ciudad: r["Indique ciudad donde reside "] ?? r.ciudad ?? "",
      universidad: r.nombre_universidad ?? r.Universidad ?? "",
      talleres: countInCols(tallerCols),
      lanzamientos: countInCols(lanzamientoCols),
      encuentros: countInCols(encuentroCols),
      reuniones: countInCols(reunionCols),
      nivel: getNivel(
        r["Años de formador "] ??
          r["Años de formador"] ??
          r.anios_formador ??
          null
      ),
    };
  });

  const columns = [
    {field: "id", headerName: "ID", flex: 1.3, minWidth: 50 },
    { field: "nombre", headerName: "Nombre", flex: 1.3, minWidth: 240 },
    { field: "grado", headerName: "Grado", flex: 0.9, minWidth: 160 },
    { field: "anio_union", headerName: "Año unión", flex: 0.65, minWidth: 120 },
    { field: "ciudad", headerName: "Ciudad", flex: 0.9, minWidth: 160 },
    { field: "universidad", headerName: "Universidad", flex: 1.2, minWidth: 280 },

    { field: "talleres", headerName: "Talleres", type: "number", flex: 0.55, minWidth: 110 },
    { field: "lanzamientos", headerName: "Lanz.", type: "number", flex: 0.5, minWidth: 90 },
    { field: "encuentros", headerName: "Encuent.", type: "number", flex: 0.6, minWidth: 120 },
    { field: "reuniones", headerName: "Reun.", type: "number", flex: 0.5, minWidth: 90 },

    {
      field: "nivel",
      headerName: "Nivel",
      flex: 0.9,
      minWidth: 180,
      sortable: true,
      renderCell: ({ row }) => {
        const nivel = row.nivel ?? "—";

        const bg =
          nivel === "experto"
            ? colors.green[200]
            : nivel === "intermedio"
            ? colors.orange[200]
            : colors.yellow[100];

        const Icon =
          nivel === "experto"
            ? EmojiEventsIcon
            : nivel === "intermedio"
            ? AutoAwesomeIcon
            : PsychologyIcon;

        return (
          <Box
            width="80%"
            m="0 auto"
            p="6px 10px"
            display="flex"
            gap="6px"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            sx={{
              backgroundColor: bg,
              border: "1px solid rgba(0,0,0,0.10)",
            }}
          >
            {nivel !== "—" && <Icon fontSize="small" />}
            <Typography
              color={colors.primary[100]}
              fontWeight={900}
              sx={{ textTransform: "capitalize", fontSize: "14px" }}
            >
              {nivel}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px" pb="60px">
      <Header title="PARTICIPANTES" subtitle="Resumen por persona" />

      <Box
        mt="20px"
        height="80vh" // ✅ más alto
        sx={{
          "& .MuiDataGrid-root": { border: "none" },

          // ✅ HEADER verde + negrita
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.green[200],
            borderBottom: "1px solid rgba(0,0,0,0.10)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 900,
            fontSize: "14px",
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "10px 10px",
            gap: "10px",
          },

          // ✅ texto más grande en celdas
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            fontSize: "14px",
          },

          // ✅ Footer/paginación más grande
          "& .MuiTablePagination-root": {
            fontSize: "14px",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "14px",
            fontWeight: 800,
          },
          "& .MuiTablePagination-select": {
            fontSize: "14px",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "22px",
          },

          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[200],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid rgba(0,0,0,0.08)",
            backgroundColor: colors.primary[200],
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={56}            // ✅ filas más altas
          columnHeaderHeight={56}   // ✅ header más alto
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default TablaParticipantes;
