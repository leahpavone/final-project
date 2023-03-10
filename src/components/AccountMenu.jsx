import { useState, useContext, useEffect } from "react";
import { Logout, Home, Dashboard, ManageAccounts } from "@mui/icons-material";
import { auth } from "../utilities/firebase";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import AuthContext from "../context/AuthContext";
import { MiniSpinner } from "./Spinners";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Button
} from "@mui/material";

const AccountMenu = () => {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [firstName, setFirstName] = useState("");

  const { user } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);

  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    auth.signOut();
    navigate("/");
  };

  // useEffect(() => {
  //   if (user?.name.length > 0) {
  //     const fN = user.name.split(" ")[0];
  //     setFirstName(fN);
  //     // console.log(fN);
  //   }
  // }, [user]);

  if (loading) {
    return <MiniSpinner />;
  }

  return (
    <Box>
      {currentUser ? (
        <>
          <Box
            sx={{
              width: "fit-content",
              right: 16,
              top: 16,
              position: "absolute",
              backgroundColor: "primary.light",
              borderRadius: "500px"
            }}>
            <Tooltip title="Menu">
              <IconButton
                disableRipple
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}>
                {user?.photoURL ? (
                  <>
                    <Avatar
                      src={user.photoURL.toString()}
                      sx={{ width: 40, height: 40 }}
                    />
                    {/* <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          letterSpacing: "1.5px"
                        }}>
                        {firstName}
                      </Typography>
                      <Typography variant="p">
                        <ArrowDropDown fontSize="large" />
                      </Typography>
                    </Box> */}
                  </>
                ) : (
                  <Avatar />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 1px 10px rgba(200,200,200,0.05))",
                mt: 1,
                backgroundColor: "primary.dark",
                color: "accent.main",
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 16,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <MenuItem onClick={() => navigate("/")}>
              <ListItemIcon sx={{ color: "accent.main" }}>
                <Home fontSize="small" />
              </ListItemIcon>
              Home
            </MenuItem>
            <MenuItem onClick={() => navigate("/dashboard")}>
              <ListItemIcon sx={{ color: "accent.main" }}>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => navigate("/profile-details")}>
              <ListItemIcon sx={{ color: "accent.main" }}>
                <ManageAccounts fontSize="small" />
              </ListItemIcon>
              My Account
            </MenuItem>
            <Divider />

            <MenuItem onClick={handleLogOut}>
              <ListItemIcon sx={{ color: "accent.main" }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Box
          sx={{
            right: 16,
            top: 16,
            position: "absolute"
          }}>
          <Button
            component={Link}
            variant="text"
            sx={{
              backgroundColor: "transparent",
              color: "accent.main",
              width: "fit-content",
              fontStyle: "normal",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline"
              }
            }}
            to={"/login"}>
            Login
          </Button>
          <Typography variant="p" sx={{ color: "accent.dark" }}>
            /
          </Typography>
          <Button
            component={Link}
            variant="text"
            sx={{
              backgroundColor: "transparent",
              color: "accent.main",
              width: "fit-content",
              fontStyle: "normal",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline"
              }
            }}
            to={"/register"}>
            Register
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AccountMenu;
