import { Link } from "react-router-dom";
import { Button, Container, Typography, Fade, Box } from "@mui/material";

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
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Typography variant="h3" sx={{ p: 4 }}>
            Page Not Found
          </Typography>
          <Button component={Link} variant="contained" to={"/"}>
            Go Back Home
          </Button>
        </Box>
      </Fade>
    </Container>
  );
};

export default NotFound;
