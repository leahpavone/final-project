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
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import AccountMenu from "../components/AccountMenu";
import Navbar from "../components/Navbar";
import {
  Button,
  Typography,
  Box,
  TextField,
  Container,
  InputAdornment,
  Divider
} from "@mui/material";
import { updateNameEmailFormSchema } from "../schemas";
import { Formik, Form, Field, useFormik } from "formik";
import UploadProfilePhoto from "../components/UploadProfilePhoto";
import InputField from "../components/InputField";
import UserDrawer from "../components/UserDrawer";
// import { StyledTextField } from "../components/InputField";

function ProfileDetails() {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [cPassError, setCPassError] = useState(false);
  // const [currentPassword, setCurrentPassword] = useState("");
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
        .then(
          setFieldError(
            user.name !== values.name || user.email !== values.email
              ? "Successfully updated profile details"
              : ""
          )
        )
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
      setCurrentPasswordError("");
      setCPassError(false);
      // setFieldError("");
    } catch (error) {
      console.log(error.code);

      if (error.code === "auth/wrong-password") {
        // setFieldError("Password does not match");
        setCPassError(true);
        setCurrentPasswordError("Password does not match");
      }
      if (currentPasswordRef.current.value < 0) {
        // setFieldError("Please enter your current password");
        setCPassError(true);
        setCurrentPasswordError("Please enter your current password");
      }
      setIsAuthenticated(false);
      setCPassError(true);
      // setCurrentPasswordError("Please enter your current password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(currentPasswordRef);
    try {
      await reauthenticate(currentPasswordRef.current.value);
      // setCPassError(false);
    } catch (error) {
      // setCPassError(true);
      console.log(error);
    }
    console.log(currentPasswordRef.current.value);
  };

  const formik = useFormik({
    initialValues: {
      name: currentUser.displayName,
      email: currentUser.email
    },
    validationSchema: updateNameEmailFormSchema,
    onSubmit: submitProfileDetails
  });

  return (
    <Container
      maxWidth="100vw"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "primary.main",
        width: "100%",
        bgcolor: "primary.main"
      }}>
      <AccountMenu />

      <UserDrawer />

      <Box
        sx={{
          height: "max-content",
          textAlign: "center",
          ml: { xs: 0, md: "220px" },
          mt: 3,
          pb: 3
        }}>
        <Typography
          variant="h4"
          sx={{
            // width: "fit-content",
            pb: 3
            // textAlign: "center",
            // ml: { xs: 0, md: "220px" },
            // position: "relative"
          }}>
          Account Details
        </Typography>

        {fieldError && (
          <Typography
            variant="h5"
            sx={{
              // ml: { xs: 0, md: "220px" },
              // width: { xs: 0, md: "calc(100% - 220px)" },
              display: "flex",
              // justifyContent: "center",
              color: "accent.main"
            }}>
            {fieldError}
          </Typography>
        )}
      </Box>

      {/* <Typography
        variant="h4"
        sx={{ pb: 3, textAlign: "center", ml: { xs: 0, md: "220px" } }}>
        Account Details
      </Typography>

      {fieldError && (
        <Typography
          variant="h5"
          sx={{
            // width: { xs: 0, md: "calc(100% - 220px)" },
            display: "flex",
            justifyContent: "center",
            color: "accent.main",
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, 50%)"
          }}>
          {fieldError}
        </Typography>
      )} */}

      <Box
        sx={{
          backgroundColor: "primary.main",
          display: "flex",
          // alignItems: "center",
          justifyContent: "space-evenly",
          // flexDirection: "column",
          ml: { xs: 0, md: "220px" },
          pt: 4,
          height: "max-content",
          alignItems: "flex-start",
          // width: "100%",
          // width: { xs: "80%", md: "60%" }
          width: { xs: "100%", md: "calc(100% - 220px)" }
        }}>
        {/* <Box sx={{ height: "max-content", display: "flex" }}>
          <Divider
            orientation="vertical"
            sx={{
              display: "flex",
              flex: 1,
              backgroundColor: "#fff",
              // borderColor: "accent.light",
              // borderWidth: "1px",
              // height: "100%"
            }}
          />
        </Box> */}

        <Box
          sx={{
            display: "flex",
            gap: "40px",
            // alignItems: "center",
            width: "fit-content",
            height: "100%"
            // border: (theme) => `1px solid ${theme.palette.accent.main}`,
            // borderRadius: 1,
            // bgcolor: "accent.light",
            // flex: 1
            // color: "accent.dark"
          }}>
          <Divider orientation="vertical" variant="middle" flexItem />
          <UploadProfilePhoto />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "40px",
            // alignItems: "center",
            width: "fit-content",
            height: "100%"
            // border: (theme) => `1px solid ${theme.palette.accent.main}`,
            // borderRadius: 1,
            // bgcolor: "accent.light",
            // flex: 1
            // color: "accent.dark"
          }}>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box component="form" onSubmit={submitProfileDetails}>
            <Box sx={{ display: "flex" }}>
              <Button
                fullWidth
                disabled={
                  formik.errors.name || formik.errors.email ? true : false
                }
                variant="contained"
                onClick={() => {
                  updateDetails && submitProfileDetails(formik.values);
                  setUpdateDetails((prevState) => !prevState);
                }}>
                {updateDetails ? "Done" : "Edit Details"}
              </Button>
              {/* <Typography variant="caption">{fieldError}</Typography> */}
            </Box>

            {updateDetails && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "30px",
                  paddingBottom: "20px"
                }}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
                  <Typography
                    variant="subtitle2"
                    color={formik.errors.name ? "error.main" : "accent.main"}>
                    Name
                  </Typography>
                  <TextField
                    size="small"
                    formik={formik}
                    required
                    disabled={!updateDetails}
                    error={formik.touched.name && formik.errors.name}
                    name="name"
                    defaultValue={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
                  <Typography
                    variant="subtitle2"
                    color={
                      formik.touched.email && formik.errors.email
                        ? "error.main"
                        : "accent.main"
                    }>
                    Email
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    disabled={!updateDetails}
                    error={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    type="email"
                    name="email"
                    defaultValue={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Box>
              </Box>
            )}
            {/* <Typography variant="caption">{fieldError}</Typography> */}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "40px",
            // alignItems: "center",
            width: "fit-content",
            height: "100%"
            // border: (theme) => `1px solid ${theme.palette.accent.main}`,
            // borderRadius: 1,
            // bgcolor: "accent.light",
            // flex: 1
            // color: "accent.dark"
          }}>
          <Divider orientation="vertical" variant="middle" flexItem />

          <Box>
            <Button
              variant="contained"
              sx={{
                mt: "20px",
                height: "fit-content"
              }}
              onClick={handleResetClick}>
              {isResetting ? "Cancel Reset Password" : "Reset Password"}
            </Button>

            {isResetting && (
              <Box
                sx={
                  {
                    // display: "flex",
                    // gap: "40px"
                  }
                }>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    pt: "20px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      gap: "10px",
                      width: "100%"
                    }}>
                    <Typography
                      variant="subtitle2"
                      color={cPassError ? "error.main" : "accent.main"}>
                      Enter current password
                    </Typography>
                    <TextField
                      disabled={isAuthenticated}
                      error={cPassError}
                      placeholder="Current password"
                      size="small"
                      inputRef={currentPasswordRef}
                      variant="outlined"
                      type={currentPassVisible ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={showCurrentPasswordClick}>
                            {currentPassVisible ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </InputAdornment>
                        )
                      }}
                    />

                    {/* <Box> */}
                    {cPassError && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "flex",
                          gap: "5px",
                          color: "error.main"
                        }}>
                        <ErrorOutline sx={{ height: "16px", width: "16px" }} />
                        {currentPasswordError}
                      </Typography>
                    )}
                    {/* </Box> */}

                    {/* <Box>
                  {cPassError ? (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        height: "min-content",
                        color: "error.main"
                      }}>
                      <ErrorOutline sx={{ height: "16px", width: "16px" }} />
                      {cPassError}
                    </Typography>
                  ) : (
                    ""
                  )}
                </Box> */}
                  </Box>

                  <Button
                    disabled={isAuthenticated}
                    onClick={handleSubmit}
                    type="submit"
                    component="label">
                    Submit
                  </Button>
                </Box>
                {isAuthenticated && <ResetPassword />}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ProfileDetails;

// eslint-disable-next-line no-lone-blocks
{
  /* <form onSubmit={handleSubmit}>
              <label htmlFor="enter-current-password">
                Enter current password:
              </label>
              <div>
                <input
                  id="newPassword"
                  type={currentPassVisible ? "text" : "password"}
                  placeholder="Current password"
                  sx={{ p: 1 }}
                  ref={currentPasswordRef}
                  required
                />
                <div>
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

              <div>{fieldError ? <div>{fieldError}</div> : ""}</div>

              {isAuthenticated ? (
                <></>
              ) : (
                <button type="submit" className="btn authenticate-btn">
                  Submit
                </button>
              )}
            </form> */
}
