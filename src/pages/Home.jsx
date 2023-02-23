import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import AuthContext from "../context/AuthContext";
import AccountMenu from "../components/AccountMenu";
import UserDrawer from "../components/UserDrawer";
import NoUserDrawer from "../components/NoUserDrawer";
import { PageSpinner } from "../components/Spinners";
import { Container, Typography, Fade } from "@mui/material";
// import { Link } from "react-router-dom";

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
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column"
      }}>
      {currentUser ? <UserDrawer /> : <NoUserDrawer />}
      <AccountMenu />
      <Fade in={true} timeout={500}>
        <Container
          sx={{
            textAlign: "center"
          }}>
          <Typography variant="h4" sx={{ p: 3 }}>
            listen to your favorite music
          </Typography>
        </Container>
      </Fade>
    </Container>
  );
};

export default Home;
