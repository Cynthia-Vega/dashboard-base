import { ColorModeContext, useMode} from "./theme";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import TablaParticipantes from "./scenes/participantes";

import Data from "./scenes/tabla";
import Config from "./scenes/config";
import Regiones from "./scenes/regiones";

import Universidades from "./scenes/universidades";
import Eventos from "./scenes/eventos";
import Formacion from "./scenes/formacion";




function App() {
  const [fontScale, setFontScale] = useState(1); 
  const [theme] = useMode(fontScale); 
  console.log("APP fontScale:", fontScale);

  return (
    <ColorModeContext.Provider >
        <ThemeProvider theme={theme}>
          
          <CssBaseline />
          <div className="app">
            <Sidebar />
            <main className="content">
              {/* <Topbar /> */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/participantes" element={<TablaParticipantes />} />
                <Route path="/data" element={<Data />} />
                <Route path="/config" element={<Config  fontScale={fontScale} setFontScale={setFontScale} />} />
                <Route path="/regiones" element={<Regiones />} />
                <Route path="/universidades" element={<Universidades />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/formacion" element={<Formacion />} />
              </Routes>
            </main>  
          </div>
          </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
