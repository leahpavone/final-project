import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, storage } from "../utilities/firebase";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Button, Paper, Box, Typography } from "@mui/material";
import AccountMenu from "../components/AccountMenu";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  return (
    <Paper
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "primary.main"
      }}>
      <AccountMenu />

      <h1>Dashboard</h1>
      {user && <h1 className="greeting-header">Hi, {user.name}</h1>}
    </Paper>
  );
};

export default Dashboard;
