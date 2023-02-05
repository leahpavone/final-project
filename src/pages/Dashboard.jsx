import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, storage } from "../utilities/firebase";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Button, Paper, Box, Typography, Container } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import AuthContext from "../context/AuthContext";
import { PageSpinner } from "../components/Spinners";
import UserDrawer from "../components/UserDrawer";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name.length > 0) {
      const fN = user.name.split(" ")[0];
      setFirstName(fN);
      console.log(fN);
    }
  }, [user]);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main"
      }}>
      <UserDrawer />
      <AccountMenu />
      <Container
        sx={{
          textAlign: "center"
          // ml: "220px"
        }}>
        <Typography variant="h4" sx={{ mt: 2 }}>
          {firstName}'s Dashboard
        </Typography>
      </Container>
    </Container>
  );
};

export default Dashboard;
