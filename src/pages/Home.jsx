import { Link } from "react-router-dom";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext); // only for account menu

  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        // textAlign: "center",
        bgcolor: "primary.main"
        // height: "100vh",
        // width: "100vw"
      }}>
      {currentUser ? (
        <AccountMenu />
      ) : (
        <Box
          sx={{
            right: 16,
            top: 16,
            position: "absolute"
          }}>
          <Button
            component={Link}
            variant="text"
            sx={{
              backgroundColor: "transparent",
              color: "accent.main",
              width: "fit-content",
              fontStyle: "normal",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline"
              }
            }}
            to={"/login"}>
            Login
          </Button>
          <Typography variant="p" sx={{ color: "accent.dark" }}>
            /
          </Typography>
          <Button
            component={Link}
            variant="text"
            sx={{
              backgroundColor: "transparent",
              color: "accent.main",
              width: "fit-content",
              fontStyle: "normal",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline"
              }
            }}
            to={"/register"}>
            Register
          </Button>
          {/* <Link to="/login">Login</Link> */}
          {/* <Link to="/register">Register</Link> */}
        </Box>
      )}
      <Container
        sx={{
          textAlign: "center"
        }}>
        <Typography variant="h3">listen to your favorite music</Typography>
      </Container>
    </Container>
  );
};

export default Home;
