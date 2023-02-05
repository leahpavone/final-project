import { useContext, useState } from "react";
// import PropTypes from "prop-types";
// import AppBar from "@mui/material/AppBar";
import {
  CssBaseline,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  Button
  // Link
} from "@mui/material";
import {
  Menu,
  Home,
  Star,
  FeaturedPlayList,
  Search,
  LibraryMusic
} from "@mui/icons-material";
import AuthContext from "../context/AuthContext";
import SpotifyIcon from "../assets/spotify.svg";
import { Link, NavLink } from "react-router-dom";
import { PageSpinner } from "./Spinners";

const drawerWidth = 220;

function UserDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return <PageSpinner />;
  }

  const drawer = (
    <div>
      <Toolbar
        disableGutters
        sx={{
          width: drawerWidth
        }}>
        <Button
          disableRipple
          component={Link}
          variant="text"
          sx={{
            width: "100% !important",
            display: "flex",
            flexWrap: "nowrap",
            gap: "10px",
            p: 0,
            "&.MuiButtonBase-root": {
              "&.MuiButton-text": {
                "&:hover": {
                  textDecoration: "none"
                }
              }
            }
          }}
          to={"/"}>
          <img
            src={SpotifyIcon}
            alt="google"
            style={{ height: "32px", width: "32px" }}
          />
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 500
              // ".MuiButton-text.MuiTypography-root": {
              //   color: "blue",
              //   "&:hover": {
              //     textDecoration: "none"
              //   }
              // }
            }}>
            Spotify Clone
          </Typography>
        </Button>
      </Toolbar>
      <Divider />
      <List
        sx={{
          pt: 4,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}>
        {["Home", "Search", "Favorites", "Playlists"].map((text, index) => (
          <NavLink
            key={text}
            to={
              text === "Home"
                ? "/"
                : text === "Search"
                ? "/search"
                : text === "Favorites"
                ? "/favorites"
                : text === "Playlists"
                ? "/playlists"
                : "/"
            }
            style={({ isActive }) =>
              isActive
                ? {
                    textDecoration: "none",
                    background: "#241f28",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                    height: "48px"
                  }
                : {
                    textDecoration: "none",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                    height: "48px"
                  }
            }>
            <ListItemIcon sx={{ pl: 2 }}>
              {text === "Home" && <Home sx={{ color: "accent.main" }} />}
              {text === "Search" && <Search sx={{ color: "accent.main" }} />}
              {text === "Favorites" && <Star sx={{ color: "accent.main" }} />}
              {text === "Playlists" && (
                <LibraryMusic sx={{ color: "accent.main" }} />
              )}
            </ListItemIcon>
            <ListItemText
              sx={{
                pl: 2,
                "&.MuiListItemText-root .MuiTypography-root": {
                  fontWeight: "500"
                }
              }}
              primary={text}
            />
          </NavLink>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex"
        // position: "fixed",
        // width: "calc(100% - 220px)"
      }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}> */}
      {/* <Toolbar> */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          zIndex: 999,
          xs: { display: "flex" },
          lg: { display: "none" },
          position: "absolute",
          top: 16,
          left: 16,
          ml: 1,
          width: "40px",
          height: "40px",
          color: "accent.main"
        }}>
        <Menu sx={{ color: "accent.main" }} />
      </IconButton>
      {/* <Typography variant="h6" noWrap component="div">
          Responsive drawer
        </Typography> */}
      {/* </Toolbar> */}
      {/* </AppBar> */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="music folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          PaperProps={{
            elevation: 10
          }}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "primary.darkest"
            }
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "primary.darkest"
            }
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          // width: "100%"
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}>
        <Toolbar />
        <Typography paragraph>a</Typography>
        <Typography paragraph>b</Typography>
      </Box> */}
    </Box>
  );
}

// ResponsiveDrawer.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window: PropTypes.func
// };

export default UserDrawer;
