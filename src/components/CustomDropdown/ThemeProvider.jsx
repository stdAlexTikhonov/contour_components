import React, { createContext, useState, useCallback } from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import purple from "@material-ui/core/colors/purple";

function createTheme(light) {
  const theme = {
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: "#003366",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      type: light ? "light" : "dark",
      secondary: purple,
    },
  };

  return createMuiTheme(theme);
}

export const ThemeContext = createContext({});

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(createTheme(true));

  const setThemeType = useCallback(
    (type) => {
      setTheme(createTheme(type === "light"));
    },
    [setTheme]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ theme, setThemeType }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
