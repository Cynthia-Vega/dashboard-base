
import { Box, Typography, Slider, useTheme } from "@mui/material";
import { useContext } from "react";
import { FontSizeContext, tokens } from "../../theme";
import Header from "../../components/Header";


const Config = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const ctx = useContext(FontSizeContext);

    
    const fontScale =
        ctx && typeof ctx.fontScale === "number" ? ctx.fontScale : 1;
    const setFontScale =
        ctx && typeof ctx.setFontScale === "function"
        ? ctx.setFontScale
        : () => {};

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
                value={fontScale}
                min={0.8}
                max={1.4}
                step={0.1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, value) => {
                    const v = Array.isArray(value) ? value[0] : value;
                    setFontScale(v);
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
