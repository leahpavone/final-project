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
  CardMedia,
  Paper,
  InputAdornment
} from "@mui/material";
import { updateNameEmailFormSchema } from "../schemas";
import { Formik, Form, Field, useFormik } from "formik";
import UploadProfilePhoto from "../components/UploadProfilePhoto";
import InputField from "../components/InputField";
import { StyledTextField } from "../components/InputField";

function ProfileDetails() {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState(false);
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
    console.log(currentPasswordRef);
    try {
      await reauthenticate(currentPasswordRef.current.value);
      setCurrentPasswordError(false);
    } catch (error) {
      setCurrentPasswordError(true);
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
        justifyContent: "center",
        backgroundColor: "primary.main",
        p: "40px"
      }}>
      <AccountMenu />

      {/* PUT LEFT SIDE MENU WITH FAVORITES AND PLAYLISTS */}

      <Box
        sx={{
          backgroundColor: "primary.main",
          display: "flex",
          flexDirection: "column",

          // height: "100%",
          width: "50%"
          // borderRadius: "4px",
          // border: "3px solid",
          // borderColor: "accent.main",
          // p: "20px",
          // m: "60px"
        }}>
        <Typography
          variant="h4"
          align="center"
          // color="accent.main"
          paddingBottom="30px">
          Account Details
        </Typography>
        <UploadProfilePhoto />

        <Typography
          variant="caption"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "accent.main"
          }}>
          {fieldError}
        </Typography>

        <Box component="form" onSubmit={submitProfileDetails}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: "30px",
              paddingBottom: "20px"
            }}>
            <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <Typography
                variant="subtitle2"
                color={formik.errors.name ? "error" : "accent.main"}>
                Name
              </Typography>
              <StyledTextField
                required
                disabled={!updateDetails}
                error={formik.errors.name}
                formik={formik}
                name="name"
                type="text"
                defaultValue={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // sx={{
                //   "& .MuiOutlinedInput-root.Mui-disabled": {
                //     input: {
                //       color: "accent.disabled !important"
                //     },
                //     fieldset: {
                //       borderColor: "accent.disabled !important",
                //       border: "2px solid"
                //     },
                //     "&:hover fieldset": {
                //       borderColor: "accent.disabled !important",
                //       border: "2px solid"
                //     }
                //   }
                // }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <Typography
                variant="subtitle2"
                color={
                  formik.touched.email && formik.errors.email
                    ? "error"
                    : "accent.main"
                }>
                Email
              </Typography>
              <TextField
                fullWidth
                disabled={!updateDetails}
                error={formik.errors.email}
                variant="outlined"
                // label="Email"
                type="email"
                name="email"
                defaultValue={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // sx={{
                //   "& .MuiOutlinedInput-root.Mui-disabled": {
                //     input: {
                //       color: "yellow !important"
                //     },
                //     fieldset: {
                //       borderColor: "accent.disabled !important",
                //       border: "2px solid"
                //     },
                //     "&:hover fieldset": {
                //       borderColor: "accent.disabled !important",
                //       border: "2px solid"
                //     }
                //   }
                // }}
              />
            </Box>
          </Box>
          {/* <Typography variant="caption">{fieldError}</Typography> */}

          <Box sx={{ display: "flex" }}>
            <Button
              fullWidth
              // type="submit"
              disabled={
                formik.errors.name || formik.errors.email ? true : false
              }
              variant="contained"
              sx={
                {
                  // color: "primary.main",
                  // backgroundColor: "accent.main",
                  // "&:hover": {
                  //   backgroundColor: "accent.dark",
                  //   boxShadow: "none"
                  // },
                  // "&.Mui-disabled": {
                  //   backgroundColor: "accent.dark",
                  //   boxShadow: "none"
                  // }
                }
              }
              onClick={() => {
                updateDetails && submitProfileDetails(formik.values);
                setUpdateDetails((prevState) => !prevState);
              }}>
              {updateDetails ? "Done" : "Edit Details"}
            </Button>
            {/* <Typography variant="caption">{fieldError}</Typography> */}
          </Box>
        </Box>
        <Button
          variant="contained"
          type="button"
          sx={{
            mt: "20px",
            width: "100%",
            // border: "2px solid",
            // borderColor: "primary.main",
            border: "none",
            backgroundColor: "accent.main",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "accent.dark"
              // opacity: "0.9"
            }
          }}
          onClick={handleResetClick}>
          {isResetting ? "Cancel Reset Password" : "Reset Password"}
        </Button>

        {isResetting && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "40px"
              // width: "100%"
              // justifyContent: "space-evenly"
            }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                pt: "20px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "flex-start",
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
                <Typography variant="subtitle2" color="accent.main">
                  Enter current password
                </Typography>
                <TextField
                  disabled={isAuthenticated}
                  // sx={{
                  //   width: "100%",
                  //   "& .MuiOutlinedInput-root.Mui-disabled": {
                  //     input: {
                  //       color: "accent.disabled !important"
                  //     },
                  //     fieldset: {
                  //       borderColor: "accent.disabled !important",
                  //       border: "2px solid"
                  //     },
                  //     "&:hover fieldset": {
                  //       borderColor: "accent.disabled !important",
                  //       border: "2px solid"
                  //     }
                  //   }
                  // }}
                  // sx={{
                  // width: "100%",
                  //   "& .MuiOutlinedInput-root.Mui-disabled": {
                  //     fieldset: {
                  //       borderColor: "accent.disabled !important",
                  //       border: "2px solid"
                  //     },
                  //     "& .MuiSvgIcon-root": {
                  //       color: "accent.disabled !important",
                  //       "&.Mui-focused": {
                  //         color: "accent.disabled !important"
                  //       }
                  //     }
                  //   }
                  // }}
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

                {/* <Box>
                  {fieldError ? <Box color="error.main">{fieldError}</Box> : ""}
                </Box> */}
              </Box>

              <Button
                disabled={isAuthenticated}
                onClick={handleSubmit}
                // variant="outlined"
                type="submit"
                component="label"
                sx={{
                  // color: "primary.main",
                  // backgroundColor: "accent.main",
                  backgroundColor: "transparent",
                  color: "accent.main",
                  // "&.Mui-disabled": {
                  //   color: "accent.dark"
                  // },
                  "&:hover": {
                    backgroundColor: "accent.dark",
                    boxShadow: "none"
                  }
                }}>
                Submit
              </Button>
            </Box>
            {isAuthenticated && <ResetPassword />}
          </Box>
        )}
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
