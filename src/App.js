import { AuthProvider } from "./context/AuthContext";
// import { LocalizationProvider } from "@mui/x-date-pickers";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProfileDetails from "./pages/ProfileDetails";
import { UserProvider } from "./context/UserContext";
import { CssBaseline } from "@mui/material";
import { purple, blueGrey } from "@mui/material/colors";

function App() {
  const theme = createTheme({
    palette: {
      background: "#1a1a1a",
      // mode: "dark",
      text: {
        disabled: "#4c4c4c"
      },
      primary: {
        main: "#1a1a1a",
        dark: "#171717",
        light: "#313131"
      },
      secondary: {
        main: "#faf9f6",
        dark: "#c8c7c5",
        light: "#ffffff"
      },
      accent: {
        main: "#b59bca",
        dark: "#917ca2",
        light: "#c4afd5",
        disabled: "#5b4e65"
      },
      error: {
        main: "#fff"
      },
      disabled: {
        main: "#483e51"
      }
    },
    typography: {
      // color: "#B59BCA",
      h3: {
        color: "#B59BCA",
        fontWeight: 700,
        fontSize: "64px"
      },
      h2: {
        color: "accent.main",
        fontWeight: 500,
        fontSize: "2.5rem"
      },
      p: {
        color: "accent.main",
        // fontWeight: 500,
        fontSize: "14px"
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "&.MuiTypography-root": {
            color: "#b59bca",
            "&.Mui-disabled": {
              color: "#5b4e65"
            }
          },
          "&.MuiInputBase-root": {
            "&.MuiOutlinedInput-root": {
              display: "flex",
              flex: 1,
              input: {
                color: "#917ca2"
              },
              "&.Mui-disabled": {
                borderColor: "#5b4e65",
                border: "2px solid"
              },
              "& fieldset": {
                borderColor: "#b59bca",
                borderWidth: "2px"
              },
              "&:hover:not(.Mui-error):not(.Mui-disabled) fieldset ": {
                borderColor: "#917ca2",
                borderWidth: "2px"
              },
              "&.Mui-focused:not(.Mui-error):not(.Mui-disabled) fieldset": {
                borderColor: "#917ca2",
                borderWidth: "2.5px"
              },
              "&.Mui-error fieldset": {
                borderColor: "#fff",
                borderWidth: "2.5px"
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
              color: "#b59bca",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",

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

  return (
    // <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/profile-details" element={<PrivateRoute />}>
                <Route path="/profile-details" element={<ProfileDetails />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
    // {/* </> */}
  );
}

export default App;

// #1f1e1e - dark
// #e1dfd3 - light
// #5a8077 - accent
// #6b8d85 - accentLight
// #7b9992 - accentLightest
// #51736b - accentDark
// #48665f - accentDarkest

// #272727 = dark
// #ffeedb = light
// #759FBC = accent - light blue
// #959b6e - olive green
// #81b0b2 - light blue
// #76b78b - light green
// #282724 - darkdark grey
// #fffbf2 - white
// #fffdfa - cream white
// #b3a8d5 - purple

// #fafafa - white
// #9B6F90 - purple accent
//

// {
//   /* <Box
//         sx={{
//           width: 30,
//           height: 30,
//           backgroundColor: "accent.main",
//           "&:hover": {
//             backgroundColor: "primary.main",
//             opacity: [0.9, 0.8, 0.7]
//           }
//         }}
//       /> */
// }

// const theme = createTheme({
//   palette: {
//     background: {
//       main: "#302f2e"
//     },
//     text: {
//       primary: "#faf9f6",
//       secondary: "#e1e0dd"
//     },
//     accent: {
//       main: "#b4b8d9"
//     }
//   },
//   overrides: {
//     MuiAppBar: {
//       colorPrimary: {
//         backgroundColor: "background.main",
//         color: "text.primary"
//       }
//     },
//     MuiButton: {
//       root: {
//         backgroundColor: "accent.main",
//         color: "text.primary",
//         "&:hover": {
//           backgroundColor: "accent.dark"
//         }
//       }
//     },
//     MuiTypography: {
//       h1: {
//         color: "text.primary",
//         fontWeight: 600,
//         fontSize: "3rem"
//       },
//       h2: {
//         color: "text.secondary",
//         fontWeight: 500,
//         fontSize: "2.5rem"
//       }
//     }
//   }
// });

// const theme = createTheme({
//   palette: {
//     background: {
//       main: "#F5F5F5"
//     },
//     text: {
//       primary: "#333333",
//       secondary: "#757575"
//     },
//     accent: {
//       main: "#3f51b5"
//     }
//   },
//   overrides: {
//     MuiCssBaseline: {
//       "@global": {
//         body: {
//           backgroundColor: "#F5F5F5"
//         }
//       }
//     },
//     MuiTypography: {
//       fontFamily: "Roboto",
//       h1: {
//         color: "#333333"
//       },
//       h2: {
//         color: "#333333"
//       },
//       body1: {
//         color: "#757575"
//       }
//     },
//     MuiButton: {
//       root: {
//         backgroundColor: "#3f51b5",
//         color: "#fff",
//         "&:hover": {
//           backgroundColor: "#283593"
//         }
//       }
//     }
//   }
// });
