
import { Box, Typography, Slider} from "@mui/material";
import { useContext } from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";


const Config = ({fontScale, setFontScale }) => {
    const colors = tokens();

    console.log("CONFIG fontScale:", fontScale);

    const value = typeof fontScale === "number" ? fontScale : 1;


    return (
        <Box p={3}>
            <Header
                    title="CONFIGURACIÓN"
                    subtitle="Wolis, aquí puedes modificar el tamaño de la letra"
                  />

            <Typography variant="h4" gutterBottom color={colors.primary[100]}>
                Tamaño de texto
            </Typography>

            <Slider
                value={value}
                min={0.5}
                max={2}
                step={0.1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, v) => {
                    const newValue = Array.isArray(v) ? v[0] : v;
                    setFontScale(newValue);
                }}
                sx={{
                    color: colors.green[200], 
                    '& .MuiSlider-rail': {
                    backgroundColor: colors.primary[100],
                    opacity: 0.4,
                    },
                    '& .MuiSlider-thumb': {
                    border: `2px solid ${colors.green[200]}`,
                    },
                }}
            />

            <Typography variant="h4" mt={1} color={colors.primary[100]}>
                Escala actual: {Number(fontScale).toFixed(1)}x
            </Typography>
        </Box>
    );
};

export default Config;
