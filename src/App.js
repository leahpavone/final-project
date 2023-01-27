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
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const theme = createTheme({
    palette: {
      // mode: "dark",
      primary: {
        // main: blueGrey[300]
        main: "#1f1f1f",
        dark: "#191919",
        // dark2: "#131313",
        light: "#4c4c4c"
        // light2: "#797979",
        // contrastText: "#faf9f6"
      },
      secondary: {
        main: "#faf9f6",
        dark: "#c8c7c5",
        // dark: "#7d7d7b",
        light: "#ffffff"
        // contrastText: "#1f1f1f"
      },
      accent: {
        main: "#b4b8d9",

        dark: "#7e8198",
        dark2: "#6c6e82",
        // dark2: "#484a57",
        // dark3: "#24252b",
        light: "#c3c6e1"
        // light2: "#d2d4e8",
        // contrastText: "#1f1f1f",
        // contrastTextLight: "#faf9f6"
      }
      // error: {
      //   main: "#9e0000"
      // },
    },
    typography: {
      h3: {
        color: "primary.main",
        fontWeight: 800,
        fontSize: "10px"
      }
      // h2: {
      //   color: "primary.main",
      //   fontWeight: 500,
      //   fontSize: "2.5rem"
      // }
    },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            disableRipple: true
            // textDecoration: "none"
          }
        }
      }
    }
  });

  return (
    <>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
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
      {/* </LocalizationProvider> */}
    </>
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
