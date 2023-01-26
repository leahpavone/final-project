import { useState, useRef } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../utilities/firebase";
// import AuthContext from "../context/AuthContext";
// import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

  const onChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setNewPasswordError(true);
      setResetSuccessful(false);
      setFieldError("Password must be at least 6 characters long");
    } else {
      updatePassword(auth.currentUser, newPassword)
        .then(() => {
          setFieldError("");
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
    <div className="reset-password-form-ctr">
      <>
        {resetSuccessful && (
          <div className="success-msg">Successfully updated password!</div>
        )}
      </>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <label
          htmlFor="enter-new-password"
          className="reset-password-input-label">
          Enter new password:
        </label>

        <div className="password-input-inner-ctr">
          <input
            id="newPassword"
            type={newPassVisible ? "text" : "password"}
            placeholder="New password"
            onChange={onChange}
            value={newPassword}
            className="register-input"
            sx={{ p: 1 }}
            ref={newPasswordRef}
            required
          />
          <div className="vis-icon">
            {newPassVisible ? (
              <Visibility onClick={showNewPasswordClick} sx={{ width: 20 }} />
            ) : (
              <VisibilityOff
                onClick={showNewPasswordClick}
                sx={{ width: 20 }}
              />
            )}
          </div>
        </div>
        <>
          {newPasswordError ? (
            <div className="error-msg">{fieldError}</div>
          ) : (
            ""
          )}
        </>
        <button className="save-password-btn btn">Save new password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
