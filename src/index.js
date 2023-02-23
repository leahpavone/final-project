import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    background: "#1a1a1a",
    text: {
      disabled: "#4c4c4c"
    },
    primary: {
      // main: "#1a1a1a",
      main: "#171717",
      dark: "#121212",
      darkest: "#0a0a0a",
      light: "#313131",
      lightest: "#e8e8e8",
      light2: "#2e2e2e"
    },
    // secondary: {
    //   main: "#faf9f6",
    //   dark: "#c8c7c5",
    //   light: "#ffffff"
    // },
    accent: {
      main: "#b59bca",
      dark: "#917ca2",
      light: "#c4afd5",
      disabled: "#5b4e65",
      active: "#362e3d",
      bg: "#362e3d"
    },
    divider: {
      main: "#fff"
    },

    error: {
      main: "#fff"
    },
    disabled: {
      main: "#483e51"
    }
  },
  typography: {
    color: "#b59bca",
    h4: {
      fontWeight: 700,
      fontSize: "36px"
    },
    h3: {
      fontWeight: 700,
      fontSize: "50px"
    },
    h2: {
      fontWeight: 600,
      fontSize: "64px"
    },
    p: {
      fontSize: "14px"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "&.MuiTypography-root": {
          color: "#b59bca"
        },
        "&.MuiInputBase-root": {
          borderRadius: "4px",
          // width: "fit-content",
          "&.MuiOutlinedInput-root": {
            input: {
              color: "#917ca2"
            },
            "& fieldset": {
              borderColor: "#b59bca",
              borderWidth: "1px"
            },
            "&:hover:not(.Mui-error):not(.Mui-disabled) fieldset ": {
              borderColor: "#917ca2",
              borderWidth: "2px"
            },
            "&.Mui-focused:not(.Mui-error):not(.Mui-disabled) fieldset": {
              borderColor: "#917ca2",
              borderWidth: "2px"
            },
            "&.Mui-error fieldset": {
              borderColor: "#fff",
              borderWidth: "2px"
            },
            "&.Mui-disabled fieldset": {
              border: "1px solid"
            }
          },
          "& .MuiSvgIcon-root": {
            color: "#b59bca",
            "&:hover": {
              cursor: "pointer",
              color: "#917ca2"
            },
            "&.Mui-focused": {
              color: "#917ca2"
            }
          }
        },
        "& .MuiButtonBase-root": {
          borderRadius: "4px",
          "&.MuiButton-contained": {
            color: "#1a1a1a",
            backgroundColor: "#b59bca",
            "&:hover": {
              backgroundColor: "#917ca2",
              boxShadow: "none"
            },
            "&.Mui-disabled": {
              backgroundColor: "#5b4e65"
            }
          },
          ".css-l8tig1-MuiButtonBase-root-MuiButton-root": {
            color: "#b59bca",
            boxShadow: "none !important",
            backgroundColor: "transparent",
            "&:hover": {
              color: "#5b4e65 !important"
            }
          },
          "&.MuiButton-outlined": {
            color: "#b59bca",
            backgroundColor: "transparent",
            border: "2px solid",
            borderColor: "#b59bca",
            "&:hover": {
              backgroundColor: "transparent",
              border: "2px solid",
              borderColor: "#917ca2",
              boxShadow: "none"
            },
            "&.Mui-disabled": {
              backgroundColor: "transparent",
              border: "2px solid",
              borderColor: "#5b4e65",
              color: "#5b4e65"
            }
          },
          "&.MuiButton-text": {
            disableRipple: true,
            width: "fit-content",
            color: "#b59bca",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
              color: "#917ca2",
              boxShadow: "none"
            },
            "&.Mui-disabled": {
              color: "#5b4e65"
            }
          }
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </ThemeProvider>
);
