import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
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
} from "@mui/material";
import {
  Mail,
  Menu,
  MoveToInbox,
  HomeOutlined,
  Home,
  Star,
  Search
} from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import SpotifyIcon from "../assets/spotify.svg";

const drawerWidth = 220;

function NoUserDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const drawer = (
  //   <div>
  //     <Toolbar
  //       disableGutters
  //       sx={{
  //         width: drawerWidth
  //       }}>
  //       <Button
  //         disableRipple
  //         component={Liik}
  //         variant="text"
  //         sx={{
  //           width: "100% !important",
  //           display: "flex",
  //           flexWrap: "nowrap",
  //           gap: "10px",
  //           p: 0,
  //           "&.MuiButtonBase-root": {
  //             "&.MuiButton-text": {
  //               "&:hover": {
  //                 textDecoration: "none"
  //               }
  //             }
  //           }
  //         }}
  //         to={"/"}>
  //         <img
  //           src={SpotifyIcon}
  //           alt="google"
  //           style={{ height: "32px", width: "32px" }}
  //         />
  //         <Typography
  //           sx={{
  //             fontSize: "18px",
  //             fontWeight: 500
  //             // ".MuiButton-text.MuiTypography-root": {
  //             //   color: "blue",
  //             //   "&:hover": {
  //             //     textDecoration: "none"
  //             //   }
  //             // }
  //           }}>
  //           Spotify Clone
  //         </Typography>
  //       </Button>
  //     </Toolbar>
  //     <Divider />
  //     <List
  //       sx={{
  //         pt: 4,
  //         pb: 1,
  //         display: "flex",
  //         flexDirection: "column",
  //         width: "100%"
  //       }}>
  //       {["Home", "Search"].map((text, index) => (
  //         <ListItem key={text} disablePadding>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               {text === "Search" && <Search sx={{ color: "accent.main" }} />}
  //               {text === "Home" && <Home sx={{ color: "accent.main" }} />}

  //               {/* {index % 2 === 0 ? <Home /> : <Star />} */}
  //             </ListItemIcon>
  //             <ListItemText primary={text} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //   </div>
  // );

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
        {["Home", "Search"].map((text, index) => (
          <NavLink
            key={text}
            to={text === "Home" ? "/" : text === "Search" ? "/search" : "/"}
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
      }}>
      <CssBaseline />
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
    </Box>
  );
}

//   const container =
//     window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />

//       <IconButton
//         color="inherit"
//         aria-label="open drawer"
//         edge="start"
//         onClick={handleDrawerToggle}
//         sx={{ mr: 2, display: { sm: "none" } }}>
//         <Menu sx={{ color: "accent.main" }} />
//       </IconButton>

//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         aria-label="mailbox folders">
//         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
//         <Drawer
//           container={container}
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: "block", sm: "none" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//               backgroundColor: "primary.light"
//             }
//           }}>
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", sm: "block" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//               backgroundColor: "primary.light"
//             }
//           }}
//           open>
//           {drawer}
//         </Drawer>
//       </Box>
//     </Box>
//   );
// }

// ResponsiveDrawer.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window: PropTypes.func
// };

export default NoUserDrawer;
