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


export const themeSettings = (fontScale =1) => {
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
        typography:{
            fontFamily: ["Avenir Regular", "sans-serif"].join(","),
            fontSize: 12*fontScale,
            h1:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 40 * fontScale,
            },
            h2:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 32 * fontScale,
            },
            h3:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 24 * fontScale,
            },    
            h4:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 20 * fontScale,
            },    
            h5:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 16 * fontScale,
            },    
            h6:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 14 * fontScale,
            },                    
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


export const useMode =(fontScale = 1) => {
    
    const theme = useMemo(
        () => createTheme(themeSettings(fontScale)),
        [fontScale]
    );

  return [theme];
};



/* 
blueAccent: {
                    100: "#e1e2fe",
                    200: "#c3c6fd",
                    300: "#a4a9fc",
                    400: "#868dfb",
                    500: "#6870fa",
                    600: "#535ac8",
                    700: "#3e4396",
                    800: "#2a2d64",
                    900: "#151632"grey: {

                greenAccent: {
                    100: "#0f2922",
                    200: "#1e5245",
                    300: "#2e7c67",
                    400: "#3da58a",
                    500: "#4cceac",
                    600: "#70d8bd",
                    700: "#94e2cd",
                    800: "#b7ebde",
                    900: "#dbf5ee",
                100: "#e0e0e0",
                200: "#c2c2c2",
                300: "#a3a3a3",
                400: "#858585",
                500: "#666666",
                600: "#525252",
                700: "#3d3d3d",
                800: "#292929",
                900: "#141414"
                }, 
primary: {
                100: "#d0d1d5",
                200: "#a1a4ab",
                300: "#727681",
                400: "#1F2A40",
                500: "#141b2d",
                600: "#101624",
                700: "#0c101b",
                800: "#080b12",
                900: "#040509"
                },*/