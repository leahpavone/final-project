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
import { passwordRules } from "../schemas";
import { PageSpinner } from "./Spinners";

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
    console.log(e);
    if (
      newPasswordRef.current.value.length < 6 ||
      !newPasswordRef.current.value.match(passwordRules)
    ) {
      setNewPassError(true);
      setFieldError(
        "Password must contain at least: at least 6 characters, 1 uppercase character, 1 lowercase character, and 1 numeric character."
      );
      // setLoading(false);
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
        // flex: 1,
        alignItems: "flex-end",
        width: "100%",
        justifyContent: "space-between"
        // maxWidth: "50%"
        // minHeight: "200px"
        // p: 3
      }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "flex-end"
          // flex: "1 0 auto"
          // pt: "20px"
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // height: "100%",
            flex: "1",
            // justifyContent: "flex-start",
            // gap: "1px",
            width: "100%"
          }}>
          <Typography
            variant="subtitle2"
            sx={{ color: (fieldError && "error.main") || "accent.main" }}>
            Enter new password
          </Typography>
          <Box
            sx={{
              // width: "100%",
              display: "flex",
              flexDirection: "column"
              // flex: 1
            }}>
            <TextField
              onChange={handleChange}
              // disabled={newPassError}
              // fullWidth
              // error={fieldError}
              error={newPassError}
              size="small"
              placeholder="New password"
              inputRef={newPasswordRef}
              variant="outlined"
              type={newPassVisible ? "text" : "password"}
              sx={{
                position: "relative",
                borderColor: newPassError ? "#fff" : "accent.main"
                // border: "1px solid"
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

            {/* <Box> */}
            {fieldError && (
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  gap: "5px",
                  color: "error.main",
                  pt: "5px"
                  // position: "absolute",
                  // bottom: "50%",
                  // transform: "translateY(220%)"
                }}>
                <ErrorOutline sx={{ height: "16px", width: "16px" }} />
                {fieldError}
              </Typography>
            )}
            {/* </Box> */}
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
            // display: "flex",
            // textAlign: "center",
            // flex: 0,
            // justifyContent: "flex-end",
            // flexWrap: "nowrap",
            // width: "fit-content",
            width: "100%",
            // gap: "50px",
            // fontSize: "12px",
            p: 0
            // ml: 2
          }}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default ResetPassword;
