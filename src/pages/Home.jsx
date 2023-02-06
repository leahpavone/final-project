import { Link } from "react-router-dom";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import AuthContext from "../context/AuthContext";
import UserDrawer from "../components/UserDrawer";
import NoUserDrawer from "../components/NoUserDrawer";
import { PageSpinner } from "../components/Spinners";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext); // only for account menu

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        minHeight: "100vh",
        // width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "primary.main"
      }}>
      {currentUser ? <UserDrawer /> : <NoUserDrawer />}
      <AccountMenu />

      <Container
        sx={{
          textAlign: "center"
        }}>
        <Typography variant="h4" sx={{ p: 3 }}>
          listen to your favorite music
        </Typography>
      </Container>
    </Container>
  );
};

export default Home;
