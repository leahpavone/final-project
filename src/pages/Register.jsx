import { useState, useContext, useEffect } from "react";
import OAuth from "../components/OAuth";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import NoUserDrawer from "../components/NoUserDrawer";
import AccountMenu from "../components/AccountMenu";
import RegisterForm from "../components/RegisterForm";
// import { PageSpinner } from "../components/Spinners";
import { Typography, Box, Container, Fade } from "@mui/material";

const Register = () => {
  // const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser !== null) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // if (loading) {
  //   return <PageSpinner />;
  // }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        minHeight: "100vh",
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 4,
        pb: 4
      }}>
      <NoUserDrawer />
      <AccountMenu />

      <Fade in={true} timeout={500}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "70%", md: "50%", lg: "40%" },
            minHeight: "100%",
            borderRadius: "4px",
            ml: { xs: 0, md: "220px" }
            // position: "relative"
          }}>
          <Typography
            variant="h4"
            sx={{
              height: "100%",
              color: "accent.main",
              textAlign: "center",
              paddingBottom: "20px",
              fontSize: { xs: "30px", lg: "40px" },
              fontWeight: 600,
              pt: { xs: 4, sm: 3, md: 2, lg: 1 },
              pb: 8
            }}>
            Create an Account
          </Typography>

          <RegisterForm />

          <OAuth />
        </Box>
      </Fade>
    </Container>
  );
};

export default Register;
