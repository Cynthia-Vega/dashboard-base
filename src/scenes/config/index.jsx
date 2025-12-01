
import { Box, Typography, Slider, useTheme } from "@mui/material";
import { useContext } from "react";
import { tokens } from "../../theme";
import Header from "../../components/Header";


const Config = ({fontScale, setFontScale }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    console.log("CONFIG fontScale:", fontScale);

    const value = typeof fontScale === "number" ? fontScale : 1;


    return (
        <Box p={3}>
            <Header
                    title="CONFIGURACIÓN"
                    subtitle="Wolis, aquí puedes modificar el tamaño de la letra"
                  />

            <Typography variant="h4" gutterBottom color={colors.grey[100]}>
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
                    color: colors.greenAccent[500], 
                    '& .MuiSlider-rail': {
                    backgroundColor: colors.grey[700],
                    opacity: 0.4,
                    },
                    '& .MuiSlider-thumb': {
                    border: `2px solid ${colors.greenAccent[300]}`,
                    },
                }}
            />

            <Typography variant="h4" mt={1} color={colors.grey[100]}>
                Escala actual: {Number(fontScale).toFixed(1)}x
            </Typography>
        </Box>
    );
};

export default Config;
