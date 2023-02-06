import { useState, useContext } from "react";
import { Container, Typography } from "@mui/material";
import UserDrawer from "../components/UserDrawer";
import AccountMenu from "../components/AccountMenu";
// import AuthContext from "../context/AuthContext";
// import UserContext from "../context/UserContext";
import { PageSpinner } from "../components/Spinners";
// import { Link } from "react-router-dom";

const Favorites = () => {
  const [loading, setLoading] = useState(false);

  // const { currentUser } = useContext(AuthContext);
  // const { user } = useContext(UserContext);

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

      <Container
        sx={{
          textAlign: "center"
        }}>
        <Typography variant="h4" sx={{ p: 3 }}>
          Favorites
        </Typography>
      </Container>
    </Container>
  );
};

export default Favorites;
