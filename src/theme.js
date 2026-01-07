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
        typography:{
            fontFamily: ["Avenir Regular", "sans-serif"].join(","),
            fontSize: 12,
            body1: {
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 13,
                lineHeight: 1.25,
            },
            body2: {
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 12,
                lineHeight: 1.25,
            },
            caption: {
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 11,
                lineHeight: 1.2,
            },
            subtitle1: {
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 13,
                lineHeight: 1.25,
            },
            subtitle2: {
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 12,
                lineHeight: 1.2,
            },
            h1:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 24,
            },    
            h4:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 20,
            },    
            h5:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 16,
            },    
            h6:{
                fontFamily: ["Avenir Regular", "sans-serif"].join(","),
                fontSize: 14,
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


export const useMode =() => {
    
    const theme = useMemo(
        () => createTheme(themeSettings()),
        []
    );

  return [theme];
};


