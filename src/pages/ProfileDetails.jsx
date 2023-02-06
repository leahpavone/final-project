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
import {
  ErrorOutline,
  TrendingFlat,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import AccountMenu from "../components/AccountMenu";
import {
  Button,
  Typography,
  Box,
  TextField,
  Container,
  InputAdornment,
  Divider,
  Grid,
  Snackbar
} from "@mui/material";
import { updateNameEmailFormSchema } from "../schemas";
import { useFormik } from "formik";
import UploadProfilePhoto from "../components/UploadProfilePhoto";
import InputField from "../components/InputField";
import UserDrawer from "../components/UserDrawer";

function ProfileDetails() {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [cPassError, setCPassError] = useState(false);
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
    } catch (error) {
      console.log(error.code);

      if (error.code === "auth/wrong-password") {
        setCPassError(true);
        setCurrentPasswordError("Password does not match");
      }
      if (currentPasswordRef.current.value < 0) {
        setCPassError(true);
        setCurrentPasswordError("Please enter your current password");
      }
      setIsAuthenticated(false);
      setCPassError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(currentPasswordRef);
    try {
      await reauthenticate(currentPasswordRef.current.value);
    } catch (error) {
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
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "primary.main"
        // bgcolor: "primary.main"
      }}>
      <AccountMenu />

      <UserDrawer />

      <Box
        sx={{
          height: "fit-content",
          textAlign: "center",
          ml: { xs: 0, md: "220px" },
          mt: 3,
          mb: 3
        }}>
        <Typography
          variant="h4"
          sx={{
            pb: 3
          }}>
          Account Details
        </Typography>

        {fieldError && (
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              color: "accent.main"
            }}>
            {fieldError}
          </Typography>
        )}
      </Box>

      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px solid",
          borderColor: (theme) => theme.palette.primary.light,
          borderRadius: "4px",
          ml: { xs: 0, md: "220px" },
          mb: 6,
          mt: 2,
          width: { xs: "80%", md: "calc(80% - 220px)" }
        }}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            width: "100%",
            minHeight: "180px",
            flexDirection: { xs: "column" },
            justifyContent: { xs: "center", md: "center" },
            p: 3
          }}>
          <UploadProfilePhoto />
        </Grid>

        <Divider variant="middle" sx={{ color: "primary.light" }} />

        {/* 
        //_ === (MAIN) Edit name/email  &  reset password Forms Grid CONTAINER
        */}

        <Grid
          container
          sx={{
            display: "flex",
            width: "100%",
            position: "relative"
          }}>
          {/* 
        //# -- EDIT NAME/EMAIL FORM GRID Item
        */}

          <Grid
            item
            xs={12}
            lg={6}
            component="form"
            onSubmit={submitProfileDetails}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              height: "100%",
              // minHeight: "150px",
              // flexDirection: "column",
              width: { xs: "100%" },
              flexDirection: { xs: "column" },
              // justifyContent: { xs: "center", md: "center" },
              p: 3
            }}>
            {/* <Box> */}
            <Button
              // size="small"
              // fullWidth
              disabled={
                formik.errors.name || formik.errors.email ? true : false
              }
              variant="contained"
              onClick={() => {
                updateDetails && submitProfileDetails(formik.values);
                setUpdateDetails((prevState) => !prevState);
              }}
              sx={{ width: "max-content", height: "20px" }}>
              {updateDetails ? "Done" : "Edit Details"}
            </Button>
            {/* </Box> */}

            {/*
         //_  ==================== EDIT DETAILS FORM  
           */}

            {/* {updateDetails && ( */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: { xs: "10px", sm: "30px" }
                // height: "100%",
                // paddingBottom: "20px"
              }}>
              <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: (!updateDetails && "text.disabled") || "accent.main"
                  }}>
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

              <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: (!updateDetails && "text.disabled") || "accent.main"
                  }}>
                  Email
                </Typography>
                {/* <Typography
                  variant="subtitle2"
                  color={
                    formik.touched.email && formik.errors.email
                      ? "error.main"
                      : "accent.main"
                  }>
                  Email
                </Typography> */}
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
            {/* )} */}
          </Grid>

          {/* 
// # xsmall screen divider
*/}

          <Divider
            variant="middle"
            sx={{
              color: "primary.light",
              display: { xs: "flex", lg: "none" },
              flex: 1
            }}
          />

          {/* 
// # large screen divider
*/}

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              position: "absolute",
              height: "90%",
              left: "50%",
              color: "primary.light",
              display: { xs: "none", lg: "flex" }
            }}
          />

          {/*
         //_  ====================  RESET PARENT GRID CONTAINER 
           */}

          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              height: "100%",
              width: { xs: "100%", md: "50%" },
              flexDirection: { xs: "column", sm: "column" },
              justifyContent: { xs: "center", md: "center" },
              p: 3
            }}>
            {/* 
// # -- Reset Password Button
*/}

            <Button
              size="small"
              disabled={isResetting}
              variant="contained"
              sx={{
                width: "max-content",
                height: "20px"
              }}
              onClick={handleResetClick}>
              {/* {isResetting ? "Cancel" : "Reset Password"} */}
              Reset Password
            </Button>

            {/*
         //_  =============  current & new password FORMs (Grid Container) 
           */}

            {/* {isResetting && ( */}
            <Grid
              container
              sx={{
                display: "flex",
                flex: "1",
                alignItems: { xs: "", lg: "" },
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                gap: { xs: "10px" }
                // border: "1px solid yellow"
              }}>
              {/*
         //#  ===============  current password FORM (Grid Item) 
           */}

              <Grid
                item
                xs={12}
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: { xs: "100%", lg: "50%" },
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  // border: "2px solid orange",
                  // flexDirection: { xs: "row", md: "column" },
                  flex: 1
                }}>
                {/*
                        //#  -- Current Password label, input, error container (Box)
                        */}

                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flex: "1"
                    // alignItems: "center",
                    // justifyContent: "flex-start",
                    // gap: "1px",
                    // width: { xs: "100%", lg: "50%" }
                  }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color:
                        (!isResetting && "text.disabled") ||
                        (cPassError && "#fff") ||
                        "accent.main"
                    }}>
                    Enter your password
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      disabled={isAuthenticated || !isResetting}
                      display={isAuthenticated ? "none" : "inline"}
                      error={cPassError}
                      placeholder="Current password"
                      size="small"
                      inputRef={currentPasswordRef}
                      variant="outlined"
                      type={currentPassVisible ? "text" : "password"}
                      sx={{ position: "relative" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={showCurrentPasswordClick}>
                            {currentPassVisible ? (
                              <Visibility fontSize="small" />
                            ) : (
                              <VisibilityOff fontSize="small" />
                            )}
                          </InputAdornment>
                        )
                      }}
                    />

                    {/*
                        //#  --- Current Password Error 
                        */}

                    {cPassError && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "flex",
                          gap: "5px",
                          color: "error.main",
                          position: "absolute",
                          // bottom: "50%",
                          transform: "translateY(220%)"
                        }}>
                        <ErrorOutline sx={{ height: "16px", width: "16px" }} />
                        {currentPasswordError}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/*
                        //#  -- Current Password Submit Button container & button (Box)
                        */}
                <Box sx={{ display: "flex" }}>
                  <Button
                    disabled={isAuthenticated || !isResetting}
                    onClick={handleSubmit}
                    type="submit"
                    component="label">
                    <TrendingFlat
                      fontSize="medium"
                      sx={{
                        color: "primary.light",
                        backgroundColor:
                          !isResetting || isAuthenticated
                            ? "accent.disabled"
                            : "accent.dark",
                        borderRadius: "4px",
                        height: "20px"
                      }}
                    />
                  </Button>
                </Box>
              </Grid>

              {/*
                        //_  ================== ENTER NEW PASSWORD FORM GRID CONTAINER 
                        */}

              {/*
         //#  ================  new password FORM (Grid Item) 
           */}
              <Grid
                item
                xs={12}
                sx={{
                  width: { xs: "100%", lg: "50%" },
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  flex: 1
                }}>
                {isAuthenticated && <ResetPassword />}
              </Grid>
            </Grid>
            {/* )} */}
          </Grid>
        </Grid>
        {/* <Divider
          // orientation="vertical"
          variant="middle"
          flexItem
          sx={{ color: "primary.light", borderRightWidth: "1px" }}
        /> */}
      </Grid>
    </Container>
  );
}

export default ProfileDetails;

// eslint-disable-next-line no-lone-blocks
{
  /* <Box
  sx={{
    backgroundColor: "primary.main",
    display: "flex",
    justifyContent: "center",
    ml: { xs: 0, md: "220px" },
    pt: 4,
    height: "max-content",
    alignItems: "flex-start",
    width: { xs: "100%", md: "calc(100% - 220px)" }
  }}>
  <Divider orientation="vertical" variant="middle" flexItem sx={{}} />
  <Box sx={{ p: " 0 40px" }}>
    <UploadProfilePhoto />
  </Box>

  <Divider orientation="vertical" variant="middle" flexItem />

  <Box component="form" onSubmit={submitProfileDetails} sx={{ p: " 0 40px" }}>
    <Box sx={{ display: "flex" }}>
      <Button
        fullWidth
        disabled={formik.errors.name || formik.errors.email ? true : false}
        variant="contained"
        onClick={() => {
          updateDetails && submitProfileDetails(formik.values);
          setUpdateDetails((prevState) => !prevState);
        }}>
        {updateDetails ? "Done" : "Edit Details"}
      </Button>
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
        <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
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

        <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
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
  </Box>

  <Divider orientation="vertical" variant="middle" flexItem />

  <Box sx={{ p: " 0 40px" }}>
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
       >
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
                    {currentPassVisible ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                )
              }}
            />

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
  <Divider orientation="vertical" variant="middle" flexItem sx={{}} />
</Box>; */
}
