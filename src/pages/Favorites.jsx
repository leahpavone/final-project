import { useState, useContext } from "react";
import UserDrawer from "../components/UserDrawer";
import AccountMenu from "../components/AccountMenu";
import UserContext from "../context/UserContext";
import { PageSpinner } from "../components/Spinners";
import { Container, Typography, Box, Fade } from "@mui/material";
// import { Link } from "react-router-dom";

const Favorites = () => {
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
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column"
      }}>
      <UserDrawer />
      <AccountMenu />
      <Fade in={true} timeout={500}>
        <Container
          sx={{
            textAlign: "center"
          }}>
          <Typography variant="h4" sx={{ p: 3 }}>
            Favorites
          </Typography>
          {user?.favorites?.length > 0 ? (
            user?.favorites.map((favorite, id) => (
              <Typography variant="h6" key={id}>
                {favorite}
              </Typography>
            ))
          ) : (
            <Typography variant="h5">
              You do not have any favorites yet
            </Typography>
          )}
        </Container>
      </Fade>
    </Container>
  );
};

export default Favorites;
