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
  FormHelperText,
  Box,
  InputLabel,
  Stack,
  Grid,
  Divider
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Password,
  AccountBox,
  CalendarToday
} from "@mui/icons-material";
import { registerFormSchema } from "../schemas";
import { useFormik, Formik, ErrorMessage } from "formik";
import { blueGrey } from "@mui/material/colors";

export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: theme.palette.accent.main
  },
  "& label.Mui-focused": {
    color: theme.palette.accent.dark,
    "&.Mui-error": {
      color: theme.palette.error.main
    }
  },
  "& .MuiOutlinedInput-root": {
    input: {
      color: theme.palette.accent.dark
    },
    "& fieldset": {
      borderColor: theme.palette.accent.main,
      borderWidth: "2px"
    },
    "&:hover:not(.Mui-error) fieldset ": {
      borderColor: theme.palette.accent.dark,
      borderWidth: "2px"
    },
    "&.Mui-focused:not(.Mui-error) fieldset": {
      borderColor: theme.palette.accent.dark,
      borderWidth: "2.5px"
    },
    "&.Mui-error fieldset": {
      borderColor: theme.palette.error,
      borderWidth: "2.5px"
    }
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.accent.main,
    "&.Mui-focused": {
      color: theme.palette.accent.dark
    }
  }
}));

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

      dayjs(userBirthday, "MM/DD/YYYY").isValid();

      await axios
        .post(
          "http://127.0.0.1:5001/final-project-42d93/us-central1/api/createUser",
          {
            uid: userCredential.user.uid,
            name,
            email,
            phoneNumber,
            birthday: userBirthday,
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
  console.log(formik);

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "primary.main"
      }}>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          width: "50%",
          height: "550px",
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
              <CustomTextField
                sx={{ display: "flex", flex: "1" }}
                placeholder="Full name"
                size="small"
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccountBox />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                sx={{ display: "flex", flex: "1" }}
                placeholder="johndoe@gmail.com"
                size="small"
                id="outlined-email"
                name="email"
                label="Email"
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                sx={{ display: "flex", flex: "1" }}
                placeholder="xxx-xxx-xxxx"
                size="small"
                error={formik.errors.phoneNumber && formik.touched.phoneNumber}
                variant="outlined"
                label="Phone Number"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                id="outlined-phoneNumber"
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Phone />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture
                  value={userBirthday}
                  InputAdornmentProps={{ style: { p: 0 } }}
                  // value={formik.values.birthday}
                  onChange={(e) => setUserBirthday(e)}
                  mask="__/__/____"
                  inputFormat="MM/DD/YYYY"
                  renderInput={(props) => (
                    <CustomTextField
                      {...props}
                      sx={{ display: "flex", flex: "1" }}
                      size="small"
                      placeholder="MM/DD/YYYY"
                      label="Birthday"
                      name="birthday"
                      value={formik.values.birthday}
                      onChange={formik.handleChange}
                      helperText={
                        formik.touched.birthday && formik.errors.birthday
                      }
                      error={formik.errors.birthday && formik.touched.birthday}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Password"
                sx={{ display: "flex", flex: "1" }}
                size="small"
                error={formik.errors.password && formik.touched.password}
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                id="outlined-adornment-password"
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
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Confirm password"
                sx={{ display: "flex", flex: "1" }}
                size="small"
                error={
                  formik.errors.confirmPassword &&
                  formik.touched.confirmPassword
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                variant="outlined"
                label="Confirm Password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.onBlur}
                id="outlined-adornment-confirmPassword"
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
            </Grid>
          </Grid>

          <Button
            disableRipple
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
            sx={{
              color: "accent.main",
              backgroundColor: "transparent",
              borderColor: "accent.main",
              border: "2px solid",
              boxShadow: "none",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: "accent.dark",
                scale: "101%",
                boxShadow: "none"
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
                color: "rgba(0, 0, 0, 0.2)",
                "&::before": {
                  borderTop: "thin solid rgba(0, 0, 0, 0.2)"
                },
                "&::after": {
                  borderTop: "thin solid rgba(0, 0, 0, 0.2)"
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
            <Typography variant="p" sx={{ color: "primary.light" }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              variant="text"
              sx={{
                backgroundColor: "transparent",
                color: "primary.main",
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
