import { useState, useRef } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../utilities/firebase";
// import AuthContext from "../context/AuthContext";
// import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Typography, InputAdornment } from "@mui/material";
import { StyledTextField } from "../components/InputField";
import { passwordRules } from "../schemas";

function ResetPassword() {
  const [newPassVisible, setNewPassVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const [fieldError, setFieldError] = useState("");

  // const { currentUser } = useContext(AuthContext);
  // const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const newPasswordRef = useRef();

  const showNewPasswordClick = async () => {
    setNewPassVisible(!newPassVisible);
  };

  // const onChange = (e) => {
  //   setNewPassword(e.target.value);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPasswordRef.current.value.length < 6) {
      setNewPasswordError(true);
      setResetSuccessful(false);
      setFieldError("Password must be at least 6 characters long");
    } else if (!newPasswordRef.current.value.match(passwordRules)) {
      setNewPasswordError(true);
      setResetSuccessful(false);
      setFieldError(
        "Password must contain at least: 1 uppercase character, 1 lowercase character, and 1 numeric character."
      );
      newPasswordRef.current.value = "";
    } else {
      updatePassword(auth.currentUser, newPasswordRef.current.value)
        .then(() => {
          setFieldError("successfully updated password!");
          setNewPasswordError(false);
          setResetSuccessful(true);
          console.log("successfully changed password");
          setTimeout(() => {
            auth.signOut();
            navigate("/login");
          }, 5000);
        })
        .catch((error) => {
          setNewPasswordError(true);
          console.log(error);
        });
    }
  };

  return (
    //   <>{resetSuccessful && <div>Successfully updated password!</div>}</>
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
          // justifyContent: "flex-start",
          gap: "10px",
          width: "100%",
          pt: "20px"
        }}>
        <Typography variant="subtitle2" color="accent.main">
          Enter current password
        </Typography>
        <StyledTextField
          placeholder="New password"
          size="small"
          inputRef={newPasswordRef}
          // onChange={(e) => setNewPassword(e.target.value)}
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

        {/* <Box>
          {newPasswordError ? <Box color="error.main">{fieldError}</Box> : ""}
        </Box> */}

        <Button
          type="submit"
          component="label"
          onClick={handleSubmit}
          // sx={{
          //   // color: "primary.main",
          //   backgroundColor: "transparent",
          //   color: "accent.main",
          //   // width: "50%",
          //   "&:hover": {
          //     color: "accent.light"
          //     // backgroundColor: "accent.dark",
          //     // boxShadow: "none"
          //   }
          // }}
        >
          Save new password
        </Button>
      </Box>
    </Box>

    // <div>
    //   <>{resetSuccessful && <div>Successfully updated password!</div>}</>
    //   <Box component="form" onSubmit={handleSubmit}>
    //     <label htmlFor="enter-new-password">Enter new password:</label>

    //     <div>
    //       <input
    //         id="newPassword"
    //         type={newPassVisible ? "text" : "password"}
    //         placeholder="New password"
    //         onChange={onChange}
    //         value={newPassword}
    //         sx={{ p: 1 }}
    //         ref={newPasswordRef}
    //         required
    //       />
    //       <div>
    //         {newPassVisible ? (
    //           <Visibility onClick={showNewPasswordClick} sx={{ width: 20 }} />
    //         ) : (
    //           <VisibilityOff
    //             onClick={showNewPasswordClick}
    //             sx={{ width: 20 }}
    //           />
    //         )}
    //       </div>
    //     </div>
    //     <>{newPasswordError ? <div>{fieldError}</div> : ""}</>
    //     <button>Save new password</button>
    //   </Box>
    // </div>
  );
}

export default ResetPassword;
