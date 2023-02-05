import { useState, useEffect } from "react";
import { auth } from "../utilities/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { PageSpinner } from "../components/Spinners";
import AccountMenu from "../components/AccountMenu";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setEmailSent(true);
      setFieldError("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const code = error.code;
      const message = error.message;
      console.error({ code, message });
      setLoading(false);
      if (error.code === "auth/user-not-found") {
        setFieldError("User not found");
      }
      if (error.code === "auth/invalid-email") {
        setFieldError("Please enter a valid email");
      }
      setEmailSent(false);
      console.log(error);
    }
    return console.log("done");
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "primary.main"
      }}>
      <AccountMenu />
      <Typography variant="h4" sx={{ p: 2 }}>
        Reset your password
      </Typography>
      {emailSent && (
        <Typography variant="h5" color="error.main">
          Email sent! Please follow the instructions contained in the email.
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          gap: "10px"
        }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "40%",
            pt: "30px",
            height: "100%",
            gap: "10px"
          }}>
          <Typography variant="subtitle2">Please enter your email:</Typography>
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            type="text"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="text"
            sx={{
              width: "fit-content",
              height: "fit-content",
              p: 0
            }}>
            Submit
          </Button>
          {fieldError ? (
            <Box sx={{ color: "error.main" }}>{fieldError}</Box>
          ) : (
            ""
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
