import { useState, useContext } from "react";
import { Container, Typography } from "@mui/material";
import UserDrawer from "../components/UserDrawer";
import AccountMenu from "../components/AccountMenu";
import { PageSpinner } from "../components/Spinners";
import NoUserDrawer from "../components/NoUserDrawer";
// import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
// import UserContext from "../context/UserContext";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

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
      {currentUser ? <UserDrawer /> : <NoUserDrawer />}
      <AccountMenu />

      <Container
        sx={{
          textAlign: "center"
        }}>
        <Typography variant="h4" sx={{ p: 3 }}>
          Search
        </Typography>
      </Container>
    </Container>
  );
};

export default Search;
