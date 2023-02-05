import { Box, Button, Container, Typography } from "@mui/material";
import UserDrawer from "../components/UserDrawer";
import { Link } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import { useState, useEffect, useContext } from "react";
import { PageSpinner } from "../components/Spinners";

const Playlists = () => {
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <>
      {!loading ? (
        <Container
          maxWidth="100vw"
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "primary.main"
          }}>
          <UserDrawer />
          <AccountMenu />

          <Container
            sx={{
              textAlign: "center"
            }}>
            <Typography variant="h4" sx={{ p: 3 }}>
              Playlists
            </Typography>
          </Container>
        </Container>
      ) : (
        <PageSpinner />
      )}
    </>
  );
};

export default Playlists;
