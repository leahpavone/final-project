import { useState, useContext } from "react";
import { Container, Typography } from "@mui/material";
import UserDrawer from "../components/UserDrawer";
import AccountMenu from "../components/AccountMenu";
import { PageSpinner } from "../components/Spinners";
// import { Link } from "react-router-dom";
// import AuthContext from "../context/AuthContext";
// import UserContext from "../context/UserContext";

const Playlists = () => {
  const [loading, setLoading] = useState(false);
  // const { currentUser } = useContext(AuthContext);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "primary.main"
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
  );
};

export default Playlists;
