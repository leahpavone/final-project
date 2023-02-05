import { CircularProgress, Box } from "@mui/material";

export const UploadProfilePhotoSpinner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}>
      <CircularProgress size="120px" color="error" sx={{ zIndex: "9999" }} />;
    </Box>
  );
};

export const PageSpinner = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.main"
      }}>
      <CircularProgress size="220px" color="accent" sx={{ zIndex: "9999" }} />;
    </Box>
  );
};

export const MiniSpinner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.main"
      }}>
      <CircularProgress size="80px" color="accent" sx={{ zIndex: "9999" }} />;
    </Box>
  );
};
