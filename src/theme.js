import { createContext,  useMemo } from "react";
import { createTheme } from "@mui/material/styles"



export const tokens = () => ({
  green:{
        100: "#cce3e6ff",
        200: "#40b4ba",
        300: "#4caf50"},
    orange:{
        100: "#fdf1f0",
        200: "#fd756b",},
    yellow:{
        100: "#e8d56c",},
    azul:{
        100: "#567eb9",},
    purple:{
        100: "#9c7eb6",},
    primary: {
                100: "#000000ff",
                200: "#ffffffff"
                },
            
});




export const themeSettings = () => {
    const colors = tokens();

    return {
        palette: {
                        primary: {
                            main: colors.primary[100],
                        },
                        secondary: {
                            main: colors.green[200],
                        },
                        background:{
                            default: "#ffffffff",   
                        }
                    },
        typography: {
            fontFamily: ["Avenir", "Avenir Regular", "sans-serif"].join(","),
            fontSize: 12,

            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 600,
            fontWeightBold: 700,

            body1: { fontSize: 13, lineHeight: 1.25, fontWeight: 400 },
            body2: { fontSize: 12, lineHeight: 1.25, fontWeight: 400 },
            caption: { fontSize: 11, lineHeight: 1.2, fontWeight: 400 },
            subtitle1: { fontSize: 13, lineHeight: 1.25, fontWeight: 600 },
            subtitle2: { fontSize: 12, lineHeight: 1.2, fontWeight: 600 },

            h1: { fontSize: 40, fontWeight: 700 },
            h2: { fontSize: 32, fontWeight: 700 },
            h3: { fontSize: 24, fontWeight: 700 },
            h4: { fontSize: 20, fontWeight: 700 },
            h5: { fontSize: 16, fontWeight: 700 },
            h6: { fontSize: 14, fontWeight: 700 },
        },

        tooltip: {
            color: "#626262"
        }
    };
};


// context for color mode

export const ColorModeContext = createContext({
    toggleColorMode: () => {}
})


export const useMode =() => {
    
    const theme = useMemo(
        () => createTheme(themeSettings()),
        []
    );

  return [theme];
};


