import { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { Typography, Container } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import { PageSpinner } from "../components/Spinners";
import UserDrawer from "../components/UserDrawer";

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
      <Container
        sx={{
          textAlign: "center"
        }}>
        <Typography variant="h4" sx={{ mt: 2 }}>
          {firstName}'s Dashboard
        </Typography>
      </Container>
    </Container>
  );
};

export default Dashboard;
