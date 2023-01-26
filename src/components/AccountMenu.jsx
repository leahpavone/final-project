import { useState, useContext } from "react";

import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { Logout, Home, Dashboard } from "@mui/icons-material";
import { auth } from "../utilities/firebase";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { user } = useContext(UserContext);

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

  return (
    <>
      <Box
        sx={{
          right: 16,
          top: 16,
          position: "absolute"
        }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            // sx={{ mr: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}>
            {user?.photoURL ? (
              <Avatar
                src={user.photoURL.toString()}
                sx={{ width: 48, height: 48 }}
              />
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
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
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
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => navigate("/profile-details")}>
          <Avatar /> My account
        </MenuItem>
        <Divider />

        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
