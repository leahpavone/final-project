import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utilities/firebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  updateProfile
} from "firebase/auth";
import AuthContext from "../context/AuthContext";
import OAuth from "../components/OAuth";
import {
  Button,
  Typography,
  InputAdornment,
  TextField,
  Box,
  Grid,
  Divider
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Visibility,
  VisibilityOff,
  Phone,
  Error,
  ErrorOutline
} from "@mui/icons-material";
import { registerFormSchema } from "../schemas";
import { useFormik } from "formik";
import InputField from "../components/InputField";
import { StyledTextField } from "../components/InputField";

const Register = () => {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  const [userBirthday, setUserBirthday] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    // actions.resetForm();
    const { name, email, password, phoneNumber, birthday } = values;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name
      });
      delete userCredential.password;
      //     const token = await auth.currentUser.getIdToken(true);

      await axios
        .post(
          "http://127.0.0.1:5001/final-project-42d93/us-central1/api/createUser",

          {
            uid: userCredential.user.uid,
            name,
            email,
            phoneNumber,
            birthday: dayjs(userBirthday).format("MM/DD/YYYY"),
            photoURL: null,
            playlists: [],
            favorites: [],
            createdAt: dayjs(userCredential.user.metadata.creationTime).format(
              "M/D/YYYY h:mm A"
            ),
            updatedAt: dayjs().format("M/D/YYYY h:mm A")
          }
        )
        .catch((error) => console.log(error));
      navigate("/dashboard");
      console.log("profile added");
    } catch (error) {
      const code = error.code;
      const message = error.message;
      console.error({ code, message });
    }
  };

  const showCurrentPasswordClick = async () => {
    setCurrentPassVisible(!currentPassVisible);
  };
  const showConfirmPasswordClick = async () => {
    setConfirmPassVisible(!confirmPassVisible);
  };

  useEffect(() => {
    if (auth.currentUser !== null) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      birthday: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: registerFormSchema,
    onSubmit
  });
  // console.log(formik);

  return (
    <Box
      sx={{
        maxWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "primary.main"
      }}>
      <Box
        sx={{
          backgroundColor: "primary.main",
          width: "50%",
          height: "max-content",
          borderRadius: "4px",
          p: 3,
          display: "flex",
          flexDirection: "column"
        }}>
        <Typography
          variant="h4"
          sx={{
            color: "accent.main",
            textAlign: "center",
            paddingBottom: "20px"
          }}>
          Sign Up
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputField
                formik={formik}
                name="name"
                label="Name"
                type="text"
                placeholder="Full name"
                value={formik.values.name}
              />
            </Grid>

            <Grid item xs={6}>
              <InputField
                formik={formik}
                name="email"
                label="Email"
                type="email"
                placeholder="janedoe@gmail.com"
                value={formik.values.email}
              />
            </Grid>

            <Grid item xs={6}>
              <InputField
                formik={formik}
                name="phoneNumber"
                label="Phone number"
                type="text"
                placeholder="xxx-xxx-xxxx"
                value={formik.values.phoneNumber}
              />
            </Grid>

            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Typography
                  variant="subtitle2"
                  color={
                    formik.touched.birthday && formik.errors.birthday
                      ? "error"
                      : "accent.main"
                  }>
                  Birthday
                </Typography>
                <DatePicker
                  disableMaskedInput={false}
                  disableFuture={true}
                  // minDate={dayjs("1900-01-01").format("MM/DD/YYYY")}
                  // maxDate={dayjs().format("MM/DD/YYYY")}
                  value={userBirthday}
                  onChange={(e) => setUserBirthday(e)}
                  mask="__/__/____"
                  inputFormat="MM/DD/YYYY"
                  renderInput={(props) => (
                    <>
                      <StyledTextField
                        {...props}
                        size="small"
                        placeholder="MM/DD/YYYY"
                        name="birthday"
                        value={formik.values.birthday}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.birthday && formik.errors.birthday
                        }
                      />
                      {/* <TextField
                    //   {...props}
                    //   size="small"
                    //   placeholder="MM/DD/YYYY"
                    //   name="birthday"
                    //   value={formik.values.birthday}
                    //   onChange={formik.handleChange}
                    //   error={formik.errors.birthday && formik.touched.birthday}
                    //   sx={{
                    //     display: "flex",
                    //     flex: "1",
                    //     "& .MuiOutlinedInput-root": {
                    //       input: {
                    //         color: "accent.dark"
                    //       },
                    //       "& ::placeholder": {
                    //         color: "accent.light"
                    //       },
                    //       "& fieldset": {
                    //         borderColor: "accent.main",
                    //         borderWidth: "2px"
                    //       },
                    //       "&:hover:not(.Mui-error) fieldset ": {
                    //         borderColor: "accent.dark",
                    //         borderWidth: "2px"
                    //       },
                    //       "&.Mui-focused:not(.Mui-error) fieldset": {
                    //         borderColor: "accent.dark",
                    //         borderWidth: "2px"
                    //       },
                    //       "&.Mui-error fieldset": {
                    //         borderColor: "error",
                    //         borderWidth: "2.5px"
                    //       }
                    //     },
                    //     "& .MuiSvgIcon-root": {
                    //       color: "accent.main",
                    //       "&.Mui-focused": {
                    //         color: "accent.dark"
                    //       }
                    //     }
                    //   }}
                    // /> */}
                    </>
                  )}
                />
              </LocalizationProvider>
              <Box>
                {formik.touched.birthday && formik.errors.birthday && (
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
                    {formik.touched.birthday && formik.errors.birthday}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                color={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : "accent.main"
                }>
                Password
              </Typography>

              <StyledTextField
                placeholder="Password"
                size="small"
                error={formik.errors.password && formik.touched.password}
                // helperText={formik.touched.password && formik.errors.password}
                // FormHelperTextProps={{ position: "absolute" }}
                variant="outlined"
                // label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                type={currentPassVisible ? "text" : "password"}
                InputProps={{
                  // sx: {styles.textField},
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={showCurrentPasswordClick}>
                      {currentPassVisible ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  )
                }}
              />

              <Box>
                {formik.touched.password && formik.errors.password && (
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
                    {formik.touched.password && formik.errors.password}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="subtitle2"
                color={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "error"
                    : "accent.main"
                }>
                Confirm password
              </Typography>

              <StyledTextField
                placeholder="Confirm password"
                size="small"
                error={
                  formik.errors.confirmPassword &&
                  formik.touched.confirmPassword
                }
                // helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                // FormHelperTextProps={{ position: "absolute" }}
                variant="outlined"
                // label="Password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                type={confirmPassVisible ? "text" : "password"}
                InputProps={{
                  // sx: {styles.textField},
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={showConfirmPasswordClick}>
                      {confirmPassVisible ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  )
                }}
              />

              <Box>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
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
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword}
                    </Typography>
                  )}
              </Box>

              {/* <TextField
                placeholder="Confirm password"
                sx={{
                  display: "flex",
                  flex: "1",
                  "& .MuiOutlinedInput-root": {
                    input: {
                      color: "accent.dark"
                    },
                    "& fieldset": {
                      borderColor: "accent.main",
                      borderWidth: "2px"
                    },
                    "&:hover:not(.Mui-error) fieldset ": {
                      borderColor: "accent.dark",
                      borderWidth: "2px"
                    },
                    "&.Mui-focused:not(.Mui-error) fieldset": {
                      borderColor: "accent.dark",
                      borderWidth: "2px"
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "error",
                      borderWidth: "2.5px"
                    }
                  },
                  "& .MuiSvgIcon-root": {
                    color: "accent.main",
                    "&:hover": {
                      cursor: "pointer"
                    },
                    "&.Mui-focused": {
                      color: "accent.dark"
                    }
                  }
                }}
                size="small"
                error={
                  formik.errors.confirmPassword &&
                  formik.touched.confirmPassword
                }
                variant="outlined"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                type={confirmPassVisible ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={showConfirmPasswordClick}>
                      {confirmPassVisible ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  )
                }}
              />
              <Typography
                variant="caption"
                color={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "error"
                    : "accent.main"
                }>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </Typography> */}
            </Grid>
          </Grid>

          <Button
            disableRipple
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
            sx={{
              color: "primary.main",
              backgroundColor: "accent.main",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "accent.dark"
              }
            }}>
            Submit
          </Button>
        </Box>

        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly"
          }}>
          <Box sx={{ pt: "24px" }}>
            <Divider
              sx={{
                color: "rgba(180, 184, 217, 0.4)",
                "&::before": {
                  borderTop: "thin solid rgba(180, 184, 217, 0.4)"
                },
                "&::after": {
                  borderTop: "thin solid rgba(180, 184, 217, 0.4)"
                }
              }}>
              or
            </Divider>
          </Box>

          <OAuth />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
            <Typography variant="p" sx={{ color: "rgba(180, 184, 217, 0.4)" }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              variant="text"
              sx={{
                backgroundColor: "transparent",
                color: "accent.main",
                width: "fit-content",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                  transform: "scale(1.02)"
                }
              }}
              to={"/login"}>
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
