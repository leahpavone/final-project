import { useState, useRef } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../utilities/firebase";
import { useNavigate } from "react-router-dom";
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  TextField
} from "@mui/material";
// import { StyledTextField } from "../components/InputField";
import { passwordRules } from "../schemas";
import { PageSpinner } from "./Spinners";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [newPassVisible, setNewPassVisible] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const navigate = useNavigate();
  const newPasswordRef = useRef();

  const showNewPasswordClick = async () => {
    setNewPassVisible(!newPassVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPasswordRef.current.value.length < 6) {
      setFieldError("Password must be at least 6 characters long");
      setLoading(false);
    } else if (!newPasswordRef.current.value.match(passwordRules)) {
      setFieldError(
        "Password must contain at least: 1 uppercase character, 1 lowercase character, and 1 numeric character."
      );
      setLoading(false);
      newPasswordRef.current.value = "";
    } else {
      updatePassword(auth.currentUser, newPasswordRef.current.value)
        .then(() => {
          setLoading(false);
          setFieldError("successfully updated password!");
          console.log("successfully changed password");
          setTimeout(() => {
            auth.signOut();
            navigate("/login");
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%"
      }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          pt: "20px"
        }}>
        <Typography variant="subtitle2" color="accent.main">
          Enter new password
        </Typography>
        <TextField
          placeholder="New password"
          size="small"
          inputRef={newPasswordRef}
          variant="outlined"
          type={newPassVisible ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={showNewPasswordClick}>
                {newPassVisible ? <Visibility /> : <VisibilityOff />}
              </InputAdornment>
            )
          }}
        />

        <Box>
          {fieldError ? (
            <Typography
              variant="caption"
              sx={{
                display: "flex",
                gap: "5px",
                color: "error.main"
              }}>
              <ErrorOutline sx={{ height: "16px", width: "16px" }} />
              {fieldError}
            </Typography>
          ) : (
            ""
          )}
        </Box>

        <Button type="submit" component="label" onClick={handleSubmit}>
          Save new password
        </Button>
      </Box>
    </Box>
  );
}

export default ResetPassword;
