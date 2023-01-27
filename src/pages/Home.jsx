import { Link } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext); // only for account menu

  return (
    <>
      {currentUser && <AccountMenu />}
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h4">listen to your favorite music</Typography>
        <Box>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </Box>
      </Container>
    </>
  );
};

export default Home;
