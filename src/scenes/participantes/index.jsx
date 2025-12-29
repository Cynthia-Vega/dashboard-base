import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { ParticipantesData } from "../../data/ParticipantesData";

import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const TablaParticipantes = () => {
  const colors = tokens();

  const {
    loading,
    rawData,
    isMarked: isMarkedFromData,
    detectEventColumns: detectEventColumnsFromData,
  } = ParticipantesData();

  // ---------- fallbacks ----------
  const isMarked =
    isMarkedFromData ??
    ((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
      if (typeof v === "boolean") return v;
      const s = String(v).trim().toLowerCase();
      if (!s) return false;
      return ["1", "x", "si", "sí", "true", "ok", "✔"].includes(s);
    });

  const detectEventColumns =
    detectEventColumnsFromData ??
    ((columns) => ({
      tallerCols: columns.filter((c) => /^taller/i.test(c)),
      reunionCols: columns.filter((c) => /^reuni[oó]n/i.test(c)),
      encuentroCols: columns.filter((c) => /encuentro/i.test(c)),
      lanzamientoCols: columns.filter((c) => /lanzamiento/i.test(c)),
    }));

  if (loading) return <div>Cargando datos…</div>;

  const cols = rawData?.length ? Object.keys(rawData[0]) : [];
  const { tallerCols, reunionCols, encuentroCols, lanzamientoCols } =
    detectEventColumns(cols);

  // ---------- helpers locales ----------
  const pick = (row, keys) => {
    for (const k of keys) {
      if (row?.[k] !== undefined) return row[k];
    }
    return undefined;
  };

  // ✅ NUEVO: si viene número, lo suma como número; si viene marca, suma 1; si no, 0
  const countCell = (v) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    return isMarked(v) ? 1 : 0;
  };

  // ✅ NUEVO: suma varias columnas (no solo la primera existente)
  const sumKeys = (row, keys) => keys.reduce((acc, k) => acc + countCell(row?.[k]), 0);

  const getProgramasText = (row) => {
    const v = row?.programa_categorias_str;

    const arr = Array.isArray(v)
      ? v
      : !v
      ? []
      : String(v).split(/[;,|]/g).map((x) => x.trim());

    // unique + limpio
    const seen = new Set();
    let cleaned = arr
      .map((x) => String(x ?? "").trim())
      .filter(Boolean)
      .filter((x) => {
        const k = x.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

    // ✅ mover "Otras carreras" al final (si existe)
    const idx = cleaned.findIndex((x) => x.toLowerCase() === "otras carreras");
    if (idx !== -1) {
      const [oc] = cleaned.splice(idx, 1);
      cleaned.push(oc);
    }

    return cleaned.join(", ");
  };

  const renderCheck = ({ value }) => (
    <Typography
      fontWeight={900}
      color={value ? colors.green[200] : "rgba(0,0,0,0.35)"}
      sx={{ width: "100%", textAlign: "center" }}
    >
      {value ? "✔" : "—"}
    </Typography>
  );

  // ---------- rows ----------
  const rows = (rawData ?? []).map((r, idx) => {
    const countInCols = (arr) =>
      arr.reduce((acc, c) => acc + (isMarked(r[c]) ? 1 : 0), 0);

    const finalizo = isMarked(
      pick(r, ["CURSO - Finalizaron módulos", "CURSO - Finalizaron modulos"])
    );

    // ✅ AQUÍ ESTÁ LO TUYO: sumamos las 3 variantes de "Presentó Trabajo"
    const trabajoCount = sumKeys(r, [
      "Presenta Osorno",
    ]);

    // (opcional) si también quieres sumar poster en la misma métrica:
    const posterCount = sumKeys(r, ["Presenta Magallanes"]);

    // ✅ Total “Presentaciones” = trabajo + poster (si solo quieres trabajo, deja trabajoCount)
    const presentaciones = trabajoCount + posterCount;

    const adjudicaFondo = isMarked(
      pick(r, [
        "Adjudica fondo proyecto innovación",
        "Adjudica fondo proyecto innovacion",
      ])
    );

    const participaNumeroEspecial = isMarked(
      pick(r, ["Participa Numero Especial", "Participa Número Especial"])
    );

    const talleres = countInCols(tallerCols);
    const reuniones = countInCols(reunionCols);
    const encuentros = countInCols(encuentroCols);
    const lanzamientos = countInCols(lanzamientoCols);

    // ✅ participación (encuentro o lanzamiento)
    const participaciones = (encuentros ?? 0) + (lanzamientos ?? 0);

    // ✅ nivel directo desde columna experience (ya viene listo)
    const nivel = String(r?.experience ?? "").trim().toLowerCase() || null;

    return {
      id: r.ID ?? r.id ?? idx,
      nombre: r["Nombre y apellido"] ?? "",
      grado: r.grado_final ?? r["Grado académico"] ?? "",
      anio_union: r["Año RedFID"] ?? r.anio_union ?? "",
      ciudad: r["Ciudad"] ?? r.ciudad ?? "",
      universidad: r.nombre_universidad ?? r.Universidad ?? "",
      carrera: r.Carrera ?? r["Carrera"] ?? "",

      // eventos
      talleres,
      reuniones,
      participaciones,

      // programas como texto
      programas: getProgramasText(r),

      // indicadores
      finalizo_curso: finalizo,
      presentaciones, // ✅ ahora es NÚMERO (suma real)
      adjudica_fondo: adjudicaFondo,
      participa_numero_especial: participaNumeroEspecial,

      // nivel experiencia
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

    // programas como texto
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

    { field: "finalizo_curso", headerName: "Curso", flex: 0.55, minWidth: 105, renderCell: renderCheck },

    { field: "participaciones", headerName: "Encuentros", type: "number", flex: 0.6, minWidth: 110 },
    { field: "talleres", headerName: "Talleres", type: "number", flex: 0.55, minWidth: 110 },
    { field: "reuniones", headerName: "Reuniones", type: "number", flex: 0.5, minWidth: 90 },

    // ✅ ya no es bool: ahora es número real
    { field: "presentaciones", headerName: "Presentaciones", type: "number", flex: 0.6, minWidth: 140 },

    { field: "adjudica_fondo", headerName: "Fondo", flex: 0.5, minWidth: 90, renderCell: renderCheck },
    { field: "participa_numero_especial", headerName: "N° Esp.", flex: 0.55, minWidth: 105, renderCell: renderCheck },

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
