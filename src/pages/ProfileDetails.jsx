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
  Grid
} from "@mui/material";
import { updateNameEmailFormSchema } from "../schemas";
import { useFormik } from "formik";
import UploadProfilePhoto from "../components/UploadProfilePhoto";
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

        <Grid
          container
          sx={{
            display: "flex",
            width: "100%",
            position: "relative"
          }}>
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
              width: { xs: "100%" },
              flexDirection: { xs: "column" },
              p: 3
            }}>
            <Button
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

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: { xs: "10px", sm: "30px" }
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
          </Grid>

          {/*  xsmall screen divider  */}
          <Divider
            variant="middle"
            sx={{
              color: "primary.light",
              display: { xs: "flex", lg: "none" },
              flex: 1
            }}
          />

          {/*  large screen divider  */}
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
            <Button
              size="small"
              disabled={isResetting}
              variant="contained"
              sx={{
                width: "max-content",
                height: "20px"
              }}
              onClick={handleResetClick}>
              Reset Password
            </Button>

            <Grid
              container
              sx={{
                display: "flex",
                flex: "1",
                alignItems: { xs: "", lg: "" },
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                gap: { xs: "10px" }
              }}>
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
                  flex: 1
                }}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flex: "1"
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
                            onClick={
                              isAuthenticated || !isResetting
                                ? onclick
                                : showCurrentPasswordClick
                            }>
                            {currentPassVisible ? (
                              <Visibility
                                disabled={isAuthenticated || !isResetting}
                                fontSize="small"
                                sx={{
                                  color:
                                    isAuthenticated || !isResetting
                                      ? "#4c4c4c !important"
                                      : "accent.main"
                                }}
                              />
                            ) : (
                              <VisibilityOff
                                fontSize="small"
                                sx={{
                                  color:
                                    isAuthenticated || !isResetting
                                      ? "#4c4c4c !important"
                                      : "accent.main"
                                }}
                              />
                            )}
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
                          color: "error.main",
                          position: "absolute",
                          transform: "translateY(220%)"
                        }}>
                        <ErrorOutline sx={{ height: "16px", width: "16px" }} />
                        {currentPasswordError}
                      </Typography>
                    )}
                  </Box>
                </Box>

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
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfileDetails;
