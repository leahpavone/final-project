import { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import AccountMenu from "../components/AccountMenu";
import UserDrawer from "../components/UserDrawer";
import { PageSpinner } from "../components/Spinners";
import {
  Typography,
  Container,
  Fade,
  Slide,
  Collapse,
  Zoom,
  Grow
} from "@mui/material";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.name.length > 0) {
      setLoading(true);
      const fN = user.name.split(" ")[0];
      setFirstName(fN);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main"
      }}>
      <UserDrawer />
      <AccountMenu />
      <Fade in={true} timeout={500}>
        <Container
          sx={{
            textAlign: "center"
          }}>
          <Typography variant="h4" sx={{ mt: 2 }}>
            {firstName}'s Dashboard
          </Typography>
        </Container>
      </Fade>
    </Container>
  );
};

export default Dashboard;
