import { ColorModeContext, useMode, FontSizeContext } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import User from "./scenes/user";
import Config from "./scenes/config";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar";


function App() {
  const [theme, colorMode, fontSize] = useMode();
  console.log("APP FONTSTATE:", fontSize); //
  return (
    <ColorModeContext.Provider value={colorMode}>
      <FontSizeContext.Provider value={{ fontSize }}>
        <ThemeProvider theme={theme}>
          
          <CssBaseline />
          <div className="app">
            <Sidebar />
            <main className="content">
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/form" element={<Form />} />
                <Route path="/line" element={<Line />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/user" element={<User />} />
                <Route path="/config" element={<Config />} />
              </Routes>
            </main>  
          </div>
          </ThemeProvider>
        </FontSizeContext.Provider>
    </ColorModeContext.Provider>
  );
}

export default App;
