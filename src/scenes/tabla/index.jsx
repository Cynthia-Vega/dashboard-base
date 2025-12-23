import { Box,} from "@mui/material";
import { useEffect, useState } from "react";
import { parseExcel } from "../../utils/parseExcel";

import Header from "../../components/Header";

const Data = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExcel() {
      const data = await parseExcel("/participantes.xlsx", "/encuesta.xlsx");
      setRows(data);
      setLoading(false);
    }

    loadExcel();
  }, []);

  if (loading) return <p>Cargando base de datos...</p>;
  if (!rows.length) return <p>No hay datos</p>;

  const allColumns = Array.from(
    new Set(
      rows.flatMap((row) => Object.keys(row))
    )
  );

  return (
    <Box m="20px">
      <Header title="Data" subtitle="Aqui se puede ver la base completa)" />
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "900px" }}>
          <thead>
            <tr>
              {allColumns.map((key) => (
                <th
                  key={key}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 8px",
                    background: "#f3f3f3",
                    fontSize: "12px",
                  }}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {allColumns.map((key) => (
                  <td
                    key={key}
                    style={{
                      border: "1px solid #eee",
                      padding: "4px 8px",
                      fontSize: "12px",
                    }}
                  >
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </Box>
  );
};

export default Data;

