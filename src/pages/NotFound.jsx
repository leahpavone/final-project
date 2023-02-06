import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

const NotFound = () => {
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
      <Typography variant="h3" sx={{ p: 4 }}>
        Page Not Found
      </Typography>
      <Button component={Link} variant="contained" to={"/"}>
        Go Back Home
      </Button>
    </Container>
  );
};

export default NotFound;
