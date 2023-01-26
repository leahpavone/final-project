import { Link } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && <AccountMenu />}
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h3">listen to your favorite music</Typography>
        <div className="lr-ctr">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </Container>
    </>
  );
};

export default Home;
