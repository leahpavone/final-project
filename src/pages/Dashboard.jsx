import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, storage } from "../utilities/firebase";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Button, Paper, Box, Typography, Container } from "@mui/material";
import AccountMenu from "../components/AccountMenu";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        // fullWidth,
        // maxWidth: "100vw",
        // maxWidth: "100vw",
        // minHeight: "100vh",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "primary.main"
      }}>
      <AccountMenu />

      <h1>Dashboard</h1>
      {user && (
        <Typography variant="h2" sx={{ color: "accent.main" }}>
          Hi, {user.name}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;
