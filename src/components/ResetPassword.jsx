import { useState, useRef } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../utilities/firebase";
import { useNavigate } from "react-router-dom";
import { passwordRules } from "../schemas";
import { PageSpinner } from "./Spinners";
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  TextField
} from "@mui/material";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [newPassVisible, setNewPassVisible] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [newPassError, setNewPassError] = useState(false);

  const navigate = useNavigate();
  const newPasswordRef = useRef();

  const showNewPasswordClick = async () => {
    setNewPassVisible(!newPassVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(e);
    if (
      newPasswordRef.current.value.length < 6 ||
      !newPasswordRef.current.value.match(passwordRules)
    ) {
      setNewPassError(true);
      setFieldError(
        "Password must contain at least: at least 6 characters, 1 uppercase character, 1 lowercase character, and 1 numeric character."
      );
      setLoading(false);
      newPasswordRef.current.value = "";
    } else {
      updatePassword(auth.currentUser, newPasswordRef.current.value)
        .then(() => {
          setLoading(false);
          setNewPassError(false);
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

  const handleChange = (e) => {
    if (e.target.value.match(passwordRules) !== null) {
      setNewPassError(false);
      setFieldError("");
    }
  };

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        width: "100%",
        justifyContent: "space-between"
      }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "flex-end"
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            width: "100%"
          }}>
          <Typography
            variant="subtitle2"
            sx={{ color: (fieldError && "error.main") || "accent.main" }}>
            Enter new password
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column"
            }}>
            <TextField
              variant="outlined"
              size="small"
              type={newPassVisible ? "text" : "password"}
              placeholder="New password"
              onChange={handleChange}
              error={newPassError}
              inputRef={newPasswordRef}
              sx={{
                position: "relative",
                borderColor: newPassError ? "#fff" : "accent.main"
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={showNewPasswordClick}
                    height="max-content">
                    {newPassVisible ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )}
                  </InputAdornment>
                )
              }}
            />

            {fieldError && (
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  gap: "5px",
                  color: "error.main",
                  pt: "5px"
                }}>
                <ErrorOutline sx={{ height: "16px", width: "16px" }} />
                {fieldError}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flex: 0 }}>
        <Button
          disabled={fieldError ? true : false}
          size="small"
          type="submit"
          component="label"
          onClick={handleSubmit}
          sx={{
            width: "100%",
            p: 0
          }}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default ResetPassword;
