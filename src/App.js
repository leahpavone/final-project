import { AuthProvider } from "./context/AuthContext";
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
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";

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
        darkest: "#121212",
        light: "#313131",
        lightest: "#e8e8e8"
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
            // "&:disabled": {
            //   borderColor: "#5b4e65",
            //   border: "2px"
            // }
          },
          "&.MuiInputBase-root": {
            borderRadius: "4px",
            // "&:disabled": {
            //   borderColor: "#fff",
            //   borderWidth: "5px"
            // },
            "&.MuiOutlinedInput-root": {
              // display: "flex",
              // flex: 1,
              input: {
                color: "#917ca2"
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
              },
              "&.Mui-disabled fieldset": {
                // borderColor: "#fff",
                border: "2px solid"
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
              // height: "30px",
              // width: "250px",
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

  // extra small, xs: 0px
  // small, sm: 600px
  // medium, md: 900px
  // large, lg: 1200px
  // extra large, xl: 1536px

  return (
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
              {/* <Route path="/search" element={<PrivateRoute />}> */}
              <Route path="/search" element={<Search />} />
              {/* </Route> */}
              <Route path="/favorites" element={<PrivateRoute />}>
                <Route path="/favorites" element={<Favorites />} />
              </Route>
              <Route path="/playlists" element={<PrivateRoute />}>
                <Route path="/playlists" element={<Playlists />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
