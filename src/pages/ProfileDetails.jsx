// import { useState, useContext, useEffect, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { auth, storage } from "../utilities/firebase";
// import profilePhotoDefault from "../assets/profile-image-default.png";
// import axios from "axios";
// import {
//   updateProfile,
//   updateEmail,
//   EmailAuthProvider,
//   reauthenticateWithCredential
// } from "firebase/auth";
// import {
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
//   uploadBytes
// } from "firebase/storage";
// import { Button, Container } from "@mui/material";

// const ProfileDetails = () => {
//   const [loading, setLoading] = useState(false);
//   const [photoUploaded, setPhotoUploaded] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState(profilePhotoDefault);

//   const navigate = useNavigate();

//   const signOut = () => {
//     auth.signOut();
//     navigate("/");
//   };

//   const handleChange = (e) => {
//     if (e.target.files[0]) {
//       const profilePhotoObjectURL = URL.createObjectURL(e.target.files[0]);
//       setProfilePhoto(profilePhotoObjectURL);
//       setPhotoUploaded(true);
//     } else {
//       setPhotoUploaded(false);
//     }
//     const storageRef = ref(storage, `${profilePhoto}`);

//     // 'file' comes from the Blob or File API
//     uploadBytes(storageRef, profilePhoto).then((snapshot) => {
//       console.log("Uploaded a blob or file!");
//     });
//   };

//   const handleUpload = async () => {
//     await axios
//       .post(
//         "http://127.0.0.1:5001/final-project-42d93/us-central1/api/uploadProfilePhoto",
//         {
//           uid: auth.currentUser.uid,
//           photoURL: profilePhoto
//         }
//       )
//       .catch((error) => console.log(error));

//     updateProfile(auth.currentUser, {
//       photoURL: profilePhoto.name
//     });
//   };

//   useEffect(() => {
//     if (auth.currentUser && profilePhoto !== profilePhotoDefault) {
//       console.log(auth.currentUser.photoURL);
//       console.log(profilePhoto);
//       setProfilePhoto(profilePhoto);
//     }
//   }, [profilePhoto, photoUploaded]);

//   return (
//     <div className="page-ctr">
//       <h1>Profile Details</h1>
//       <div className="dash-content">
//         <div>Hi, {auth.currentUser.displayName}</div>
//         <div className="profile-picture-ctr">
//           <img
//             src={profilePhoto}
//             alt="avatar"
//             style={{ height: "200px", width: "250px" }}
//           />
//           <div className="profile-picture-btn-input-ctr">
//             {!photoUploaded ? (
//               <input
//                 type="file"
//                 id="photoURL"
//                 accept="image/*"
//                 onChange={handleChange}
//               />
//             ) : (
//               <button onClick={handleUpload}>Upload</button>
//             )}
//           </div>
//         </div>

//         <div>
//           <div>{auth.currentUser.displayName}</div>
//           <div>{auth.currentUser.email}</div>
//           <div>{auth.currentUser.phoneNumber}</div>
//           <div>{auth.currentUser.phoneNumber}</div>
//         </div>
//       </div>

//       <Button
//         variant="contained"
//         sx={{
//           backgroundColor: "transparent",
//           color: "#e1dfd3",
//           border: "2px solid #5a8077"
//         }}
//         className="sign-out-btn"
//         onClick={signOut}>
//         Sign Out
//       </Button>
//     </div>
//   );
// };

// export default ProfileDetails;

/* eslint-disable no-restricted-globals */
import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import { db } from "../utilities/firebase";
import {
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePhoneNumber
} from "firebase/auth";
import { auth } from "../utilities/firebase";
import { useNavigate, Link } from "react-router-dom";
import ResetPassword from "../components/ResetPassword";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import AccountMenu from "../components/AccountMenu";
import Navbar from "../components/Navbar";
import {
  Button,
  Typography,
  Box,
  TextField,
  InputLabel,
  FormHelperText,
  Container,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import { updateNameEmailFormSchema } from "../schemas";
import { Formik, Form, Field, useFormik } from "formik";
import UploadProfilePhoto from "../components/UploadProfilePhoto";

function ProfileDetails() {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const currentPasswordRef = useRef();

  const submitProfileDetails = async (values, actions) => {
    console.log(values);
    try {
      if (user.email !== values.email) {
        // Update email in firebase
        await updateEmail(currentUser, values.email);
      }

      if (user.name !== values.name) {
        // Update display name in firebase
        await updateProfile(currentUser, {
          displayName: values.name
        });
      }

      await axios
        .post(
          "http://127.0.0.1:5001/final-project-42d93/us-central1/api/updateUserInfo",
          {
            uid: user.uid,
            name: values.name,
            email: values.email,
            // phoneNumber,
            updatedAt: dayjs().format("M/D/YYYY h:mm A")
          }
        )
        .then(setFieldError("Successfully updated profile details"))
        .catch((error) => console.log(error))
        .then(
          setTimeout(() => {
            setFieldError("");
          }, 3000)
        );
    } catch (error) {
      console.log(error);
      setFieldError("Could not update profile details");
      console.log("Could not update profile details");
    }
  };

  const handleResetClick = () => {
    setIsResetting((prevState) => !prevState);
  };

  const showCurrentPasswordClick = async () => {
    setCurrentPassVisible(!currentPassVisible);
  };

  const reauthenticate = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      console.log(credential);
      const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      console.log(result);
      setIsAuthenticated(true);
      setCurrentPasswordError(false);
      setFieldError("");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/wrong-password") {
        setFieldError("Password does not match");
      }
      if (currentPasswordRef.current.value <= 0) {
        setFieldError("Please enter your current password");
      }
      setIsAuthenticated(false);
      setCurrentPasswordError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reauthenticate(currentPasswordRef.current.value);
      setCurrentPasswordError(false);
    } catch (error) {
      setCurrentPasswordError(true);
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: currentUser.displayName,
      email: currentUser.email
    },
    validationSchema: updateNameEmailFormSchema,
    onSubmit: submitProfileDetails
  });
  console.log(formik);

  return (
    <div className="page">
      {/* <Box
        sx={{
          width: 30,
          height: 30,
          backgroundColor: "accent.main",
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: [0.9, 0.8, 0.7]
          }
        }}
      /> */}

      <AccountMenu />

      <div className="profile-details-ctr">
        <Typography
          variant="h4"
          align="center"
          lineHeight="1.5"
          paddingBottom="30px">
          Account Details
        </Typography>

        <Card
          sx={{
            width: "50%",
            m: "0 auto",
            border: "3px solid",
            borderColor: "accent.main",
            backgroundColor: "accent.main",
            p: "20px"
          }}>
          {/* <div className="upload-photo-ctr"> */}
          <UploadProfilePhoto />
          {/* </div> */}

          <Box
            className="update-name-email-form"
            component="form"
            onSubmit={submitProfileDetails}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                gap: "30px"
              }}>
              <Box sx={{ display: "flex", flex: "1" }}>
                <TextField
                  sx={{ width: "100%" }}
                  // fullWidth
                  // error={formik.errors.name}
                  variant="outlined"
                  label="Name"
                  disabled={!updateDetails}
                  type="text"
                  name="name"
                  defaultValue={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Box>

              <Box sx={{ display: "flex", flex: "1" }}>
                <TextField
                  // fullWidth
                  sx={{ width: "100%" }}
                  // error={formik.errors.email}
                  variant="outlined"
                  label="Email"
                  disabled={!updateDetails}
                  type="email"
                  name="email"
                  defaultValue={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Box>
            </Box>
            <Button
              // type="submit"
              variant="contained"
              sx={{
                mt: "20px",
                width: "100%",
                backgroundColor: "primary.main",
                color: "accent.main",
                "&:hover": {
                  // backgroundColor: "primary.main",
                  // opacity: [0.9, 0.8, 0.7]
                }
              }}
              className="update-details-btn"
              onClick={() => {
                updateDetails && submitProfileDetails(formik.values);
                setUpdateDetails((prevState) => !prevState);
              }}>
              {updateDetails ? "Done" : "Edit Details"}
            </Button>
            <Typography variant="caption">{fieldError}</Typography>
          </Box>

          <div className="reset-password-ctr">
            <Button
              variant="contained"
              type="button"
              sx={{
                mt: "20px",
                width: "100%",
                border: "2px solid",
                borderColor: "primary.main",
                backgroundColor: "primary.main",
                color: "accent.main",
                "&:hover": {
                  // backgroundColor: "primary.main",
                  // opacity: "0.9"
                }
              }}
              onClick={handleResetClick}>
              Reset Password
            </Button>
            {isResetting && (
              <>
                <form className="reset-password-form" onSubmit={handleSubmit}>
                  {/* <div className="password-input-ctr"> */}
                  <label
                    htmlFor="enter-current-password"
                    className="reset-password-input-label">
                    Enter current password:
                  </label>
                  <div className="password-input-inner-ctr">
                    <input
                      id="newPassword"
                      type={currentPassVisible ? "text" : "password"}
                      placeholder="Current password"
                      // onChange={onChange}
                      className="register-input"
                      sx={{ p: 1 }}
                      ref={currentPasswordRef}
                      required
                    />
                    <div className="vis-icon">
                      {currentPassVisible ? (
                        <Visibility
                          onClick={showCurrentPasswordClick}
                          sx={{ width: 20 }}
                        />
                      ) : (
                        <VisibilityOff
                          onClick={showCurrentPasswordClick}
                          sx={{ width: 20 }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="input-error-msg">
                    {fieldError ? (
                      <div className="error-msg">{fieldError}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* </div> */}
                  {isAuthenticated ? (
                    <></>
                  ) : (
                    <button type="submit" className="btn authenticate-btn">
                      Submit
                    </button>
                  )}
                </form>
                {isAuthenticated && <ResetPassword />}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProfileDetails;
