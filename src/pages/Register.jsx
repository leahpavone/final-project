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
  Email,
  Phone,
  AccountBox
} from "@mui/icons-material";
import { registerFormSchema } from "../schemas";
import { useFormik } from "formik";
import InputField from "../components/InputField";
// import { styles } from "../components/InputField";

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

// export const styles = {
//   textField: {
//     "& .MuiOutlinedInput-root": {
//       input: {
//         color: "accent.dark"
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
//   }
// };

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

      // dayjs(userBirthday, "MM/DD/YYYY").isValid();

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
          // { Headers: ("Access-Control-Allow-Origin", "*") }
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

  const [spacing, setSpacing] = useState(6);

  // useEffect(() => {
  //   if (!formik.errors) {
  //     setSpacing(0);
  //   } else {
  //     setSpacing(2);
  //   }
  // }, [formik.errors]);

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "secondary.main"
      }}>
      <Box
        sx={{
          // border: "5px solid",
          backgroundColor: "primary.main",
          width: "50%",
          height: "max-content",
          borderRadius: "4px",
          p: 3,
          display: "flex",
          flexDirection: "column"
          // boxShadow: " inset 0 0 7px rgba(255,255,255,0.3)"
          // boxShadowColor: "rgba(255,255,255,0.3)"
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
                // icon={<AccountBox />}
              />

              {/* <CustomTextField
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
              /> */}
            </Grid>

            <Grid item xs={6}>
              <InputField
                formik={formik}
                name="email"
                label="Email"
                type="email"
                placeholder="johndoe@gmail.com"
                value={formik.values.email}
                // icon={<Email />}
              />
              {/* <CustomTextField
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
              /> */}
            </Grid>

            <Grid item xs={6}>
              <InputField
                formik={formik}
                name="phoneNumber"
                label="Phone number"
                type="text"
                placeholder="xxx-xxx-xxxx"
                value={formik.values.phoneNumber}
                icon={<Phone />}
              />
              {/* <CustomTextField
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
              /> */}
            </Grid>

            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <Typography variant="subtitle2">{label}</Typography> */}

                <DatePicker
                  disableFuture
                  value={userBirthday}
                  // label="Birthday"
                  // InputAdornmentProps={{ style: {} }}
                  // value={formik.values.birthday}
                  onChange={(e) => setUserBirthday(e)}
                  mask="__/__/____"
                  inputFormat="MM/DD/YYYY"
                  renderInput={(props) => (
                    // <InputField
                    //   {...props}
                    //   formik={formik}
                    //   name="birthday"
                    //   label="Birthday"
                    //   type="text"
                    //   placeholder="MM/DD/YYYY"
                    //   value={formik.values.birthday}
                    // />
                    <>
                      <Typography
                        variant="subtitle2"
                        color={
                          formik.touched.birthday && formik.errors.birthday
                            ? "error"
                            : "accent.main"
                        }>
                        Birthday
                      </Typography>
                      <TextField
                        {...props}
                        sx={{
                          display: "flex",
                          flex: "1",
                          "& .MuiOutlinedInput-root": {
                            input: {
                              color: "accent.dark"
                            },
                            "& ::placeholder": {
                              color: "accent.light"
                              // fontSize: "70px"
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
                            "&.Mui-focused": {
                              color: "accent.dark"
                            }
                          }
                        }}
                        size="small"
                        placeholder="MM/DD/YYYY"
                        // label="Birthday"
                        name="birthday"
                        value={formik.values.birthday}
                        onChange={formik.handleChange}
                        // helperText={
                        //   formik.touched.birthday && formik.errors.birthday
                        // }
                        error={
                          formik.errors.birthday && formik.touched.birthday
                        }
                      />
                    </>
                  )}
                />
              </LocalizationProvider>
              <Typography
                variant="caption"
                color={
                  formik.touched.birthday && formik.errors.birthday
                    ? "error"
                    : "accent.main"
                }>
                {formik.touched.birthday && formik.errors.birthday
                  ? formik.errors.birthday
                  : ""}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              {/* <InputField
                formik={formik}
                name="password"
                label="Password"
                type={currentPassVisible ? "text" : "password"}
                placeholder="Password"
                value={formik.values.phoneNumber}
                // icon={currentPassVisible ? <Visibility /> : <VisibilityOff />}
                // InputProps={{ onClick: showCurrentPasswordClick }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={showCurrentPasswordClick}>
                      {currentPassVisible ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  )
                }}
              /> */}
              <Typography
                variant="subtitle2"
                color={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : "accent.main"
                }>
                Password
              </Typography>

              <TextField
                placeholder="Password"
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
                      borderColor: "accent.light",
                      borderWidth: "2px"
                    },
                    "&.Mui-focused:not(.Mui-error) fieldset": {
                      borderColor: "accent.light",
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
                      color: "accent.light"
                    }
                  }
                }}
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
              <Typography
                variant="caption"
                color={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : "accent.main"
                }>
                {formik.touched.password && formik.errors.password}
              </Typography>
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
              <TextField
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
                  // "&:hover(.MuiInputAdornment-root)": {
                  //   cursor: "pointer"
                  // },
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
                // helperText={
                //   formik.touched.confirmPassword &&
                //   formik.errors.confirmPassword
                // }
                variant="outlined"
                // label="Confirm Password"
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
                  formik.touched.birthday && formik.errors.birthday
                    ? "error"
                    : "accent.main"
                }>
                {formik.touched.birthday && formik.errors.birthday}
              </Typography>
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
              // borderColor: "accent.main",
              // border: "2px solid",
              boxShadow: "none",
              // transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "accent.dark"
                // borderColor: "accent.light",
                // scale: "1.005",
                // boxShadow: "0 0 4px rgba(0,0,0, 0.5)"
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
