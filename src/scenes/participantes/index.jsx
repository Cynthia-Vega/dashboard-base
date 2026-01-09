import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { ParticipantesData } from "../../utils/ParticipantesData";

import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const TablaParticipantes = () => {
  const colors = tokens();

  const { loading, rawData, isMarked, detectEventColumns, pickFirst, programasTextFromRow, sumMarkedKeys, countMarkedInColumns } = ParticipantesData();

  if (loading) return <div>Cargando datos…</div>;

  const cols = rawData?.length ? Object.keys(rawData[0]) : [];
  const { tallerCols, reunionCols, encuentroCols } =
    detectEventColumns(cols);

  const renderCheck = ({ value }) => (
    <Typography
      fontWeight={900}
      color={value ? colors.green[200] : "rgba(0,0,0,0.35)"}
      sx={{ width: "100%", textAlign: "center" }}
    >
      {value ? "✔" : "—"}
    </Typography>
  );


  const rows = (rawData ?? []).map((r, idx) => {
    const countInCols = (arr) => countMarkedInColumns(r, arr);

    const finalizo = isMarked(
      pickFirst(r, ["CURSO - Finalizaron módulos", "CURSO - Finalizaron modulos"])
    );


    const trabajoCount = sumMarkedKeys(r, [
      "Presenta Osorno",
    ]);

    const posterCount = sumMarkedKeys(r, ["Presenta Magallanes"]);


    const presentaciones = trabajoCount + posterCount;

    const adjudicaFondo = isMarked(
      pickFirst(r, [
        "Adjudica fondo proyecto innovación",
        "Adjudica fondo proyecto innovacion",
      ])
    );

    const participaNumeroEspecial = isMarked(
      pickFirst(r, ["Participa Numero Especial", "Participa Número Especial"])
    );

    const talleres = countInCols(tallerCols);
    const reuniones = countInCols(reunionCols);
    const encuentros = countInCols(encuentroCols);
  


    const participaciones = (encuentros ?? 0);


    const nivel = String(r?.experience ?? "").trim().toLowerCase() || null;

    return {
      id: r.ID ?? r.id ?? idx,
      nombre: r["Nombre y apellido"] ?? "",
      grado: r.grado_final ?? r["Grado académico"] ?? "",
      anio_union: r["Año RedFID"] ?? r.anio_union ?? "",
      ciudad: r["Ciudad"] ?? r.ciudad ?? "",
      universidad: r.nombre_universidad ?? r.Universidad ?? "",
      carrera: r.Carrera ?? r["Título"] ?? "",
      talleres,
      reuniones,
      participaciones,
      programas: programasTextFromRow(r),
      finalizo_curso: finalizo,
      presentaciones, 
      adjudica_fondo: adjudicaFondo,
      participa_numero_especial: participaNumeroEspecial,
      nivel,
    };
  });

  // ---------- columns ----------
  const columns = [
    { field: "id", headerName: "ID", flex: 0.45, minWidth: 70 },
    { field: "nombre", headerName: "Nombre", flex: 1.25, minWidth: 260 },
    { field: "grado", headerName: "Grado", flex: 0.85, minWidth: 160 },
    { field: "anio_union", headerName: "Año unión", flex: 0.6, minWidth: 120 },
    { field: "ciudad", headerName: "Ciudad", flex: 0.85, minWidth: 160 },
    { field: "universidad", headerName: "Universidad", flex: 1.2, minWidth: 280 },
    { field: "carrera", headerName: "Carrera", flex: 1.0, minWidth: 240 },


    {
      field: "programas",
      headerName: "Programas",
      flex: 1.1,
      minWidth: 240,
      sortable: false,
      headerAlign: "left",
      align: "left",
      renderCell: ({ value }) => (
        <Typography
          fontSize="14px"
          fontWeight={400}
          color={colors.primary[100]}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            textAlign: "left",
          }}
          title={value || ""}
        >
          {value || "—"}
        </Typography>
      ),
    },

    { field: "finalizo_curso", headerName: "Curso", flex: 0.55, minWidth: 80, renderCell: renderCheck },

    { field: "participaciones", headerName: "Encuentros", type: "number", flex: 0.6, minWidth: 110,headerAlign: "left", },
    { field: "presentaciones", headerName: "Presentaciones", type: "number", flex: 0.6, minWidth: 140,headerAlign: "left", },
    { field: "talleres", headerName: "Talleres", type: "number", flex: 0.55, minWidth: 80, headerAlign: "left", },
    { field: "reuniones", headerName: "Reuniones", type: "number", flex: 0.5, minWidth: 100,headerAlign: "left", },

    { field: "adjudica_fondo", headerName: "Fondo", flex: 0.5, minWidth: 90, renderCell: renderCheck },
    // { field: "participa_numero_especial", headerName: "N° Esp.", flex: 0.55, minWidth: 105, renderCell: renderCheck },

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
    <Box m="20px" ml="5px" pb="100px">
      <Header title="PARTICIPANTES" subtitle="Resumen por persona" />

      <Box
        mt="20px"
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.green[200],
            borderBottom: "1px solid rgba(0,0,0,0.10)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 900,
            fontSize: "14px",
            color: colors.primary[100],
          },

          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            fontSize: "14px",
          },

          "& .MuiTablePagination-root": { fontSize: "14px" },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "14px",
            fontWeight: 800,
          },
          "& .MuiTablePagination-select": { fontSize: "14px" },
          "& .MuiSvgIcon-root": { fontSize: "22px" },

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
          rowHeight={56}
          columnHeaderHeight={56}
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
