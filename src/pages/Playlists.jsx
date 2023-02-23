import { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import UserDrawer from "../components/UserDrawer";
import AccountMenu from "../components/AccountMenu";
import { PageSpinner } from "../components/Spinners";
import { Container, Typography, Fade } from "@mui/material";
// import { Link } from "react-router-dom";

const Playlists = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

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
      <Fade in={true} timeout={500}>
        <Container
          sx={{
            textAlign: "center"
          }}>
          <Typography variant="h4" sx={{ p: 3 }}>
            Playlists
          </Typography>
          {user?.playlists?.length > 0 ? (
            user?.playlists.map((playlist, id) => (
              <Typography variant="h6" key={id}>
                {playlist}
              </Typography>
            ))
          ) : (
            <Typography variant="h5">
              You do not have any playlists yet
            </Typography>
          )}
        </Container>
      </Fade>
    </Container>
  );
};

export default Playlists;
