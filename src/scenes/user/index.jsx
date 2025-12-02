import { Box,} from "@mui/material";
import { useEffect, useState } from "react";
import { parseExcel } from "../../utils/parceExcel";

import Header from "../../components/Header";

const User = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExcel() {
      const data = await parseExcel("Seguimiento formadores revisada Agosto 2025.xlsx");
      setRows(data);
      setLoading(false);
    }

    loadExcel();
  }, []);

  if (loading) return <p>Cargando base de datos...</p>;

  if (!rows.length) return <p>No hay datos</p>;

  return (
    <Box m="20px">
      <Header title="Usuario" subtitle="Wolis, aquí puedes ver el usuario(?)" />
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "900px" }}>
          <thead>
            <tr>
              {Object.keys(rows[0]).map((key) => (
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
                {Object.keys(rows[0]).map((key) => (
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

export default User;

