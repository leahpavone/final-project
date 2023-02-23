import React, { useContext, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { auth } from "../utilities/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { registerFormSchema } from "../schemas";
import InputField from "./InputField";
import {
  ArrowBack,
  ArrowForward,
  ErrorOutline,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grow,
  InputAdornment,
  Slide,
  TextField,
  Typography
} from "@mui/material";

const RegisterForm = () => {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);
  const [userBirthday, setUserBirthday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [goBackClicked, setGoBackClicked] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    // actions.resetForm();
    const { name, email, password, phoneNumber, birthday } = values;
    try {
      setLoading(true);
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
      setLoading(false);
      navigate("/dashboard");
      // console.log("profile added");
    } catch (error) {
      setLoading(false);
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

  const handleNextButtonClick = () => {
    setStep((prevState) => prevState + 1);
    setGoBackClicked(false);
  };

  const handlePrevButtonClick = () => {
    setStep((prevState) => prevState - 1);
    setGoBackClicked(true);
  };

  const renderSteps = (step) => {
    switch (step) {
      case 1:
        return (
          <Slide
            // appear={false}
            in={step === 1}
            direction="right"
            // timeout={500}
            timeout={{ enter: 500, exit: 0 }}
            mountOnEnter
            unmountOnExit>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <InputField
                formik={formik}
                name="name"
                label="Name"
                type="text"
                placeholder="Full name"
                value={formik.values.name}
              />
              <InputField
                formik={formik}
                name="phoneNumber"
                label="Phone number"
                type="text"
                placeholder="xxx-xxx-xxxx"
                value={formik.values.phoneNumber}
              />
              <Box>
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
                    value={userBirthday}
                    onChange={(e) => setUserBirthday(e)}
                    mask="__/__/____"
                    inputFormat="MM/DD/YYYY"
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        fullWidth
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
                    )}
                  />
                </LocalizationProvider>

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
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                  // pt: 1
                }}>
                <Grow in={step === 1} timeout={1500}>
                  <Button
                    disableRipple
                    variant="contained"
                    onClick={handleNextButtonClick}
                    disabled={
                      formik.errors.name ||
                      !formik.touched.name ||
                      formik.errors.phoneNumber ||
                      !formik.touched.phoneNumber ||
                      formik.errors.birthday ||
                      !formik.touched.birthday
                        ? true
                        : false
                    }
                    sx={{
                      width: "fit-content",
                      display: "flex",
                      gap: "10px"
                    }}>
                    Next <ArrowForward />
                  </Button>
                </Grow>
              </Box>
            </Box>
          </Slide>
        );
      case 2:
        return (
          <Box>
            <Slide
              in={step === 2}
              direction="left"
              timeout={500}
              mountOnEnter
              unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                <InputField
                  formik={formik}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="janedoe@gmail.com"
                  value={formik.values.email}
                />

                <Box>
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
                    fullWidth
                    placeholder="Password"
                    size="small"
                    error={
                      Boolean(formik.errors.password) &&
                      Boolean(formik.touched.password)
                    }
                    variant="outlined"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.onBlur}
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
                <Box>
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
                    fullWidth
                    placeholder="Confirm password"
                    size="small"
                    error={
                      Boolean(formik.errors.confirmPassword) &&
                      Boolean(formik.touched.confirmPassword)
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
                          {confirmPassVisible ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </InputAdornment>
                      )
                    }}
                  />

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
              </Box>
            </Slide>
            <Box>
              <Grow in={step === 2} timeout={1500}>
                <Button
                  disableRipple
                  variant="text"
                  onClick={handlePrevButtonClick}
                  sx={{
                    backgroundColor: "transparent !important",
                    position: "absolute",
                    bottom: { xs: "105%", md: "50%" },
                    left: { xs: "-10%", sm: "-5%", md: "-20%" }
                  }}>
                  <ArrowBack />
                </Button>
              </Grow>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",

        position: "relative"
      }}>
      <Box>{renderSteps(step)}</Box>
      {step === 2 && (
        <Grow in={step === 2} timeout={1500}>
          <Button
            disableRipple
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
            sx={{
              width: "100%",
              color: "primary.main",
              backgroundColor: "accent.main",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "accent.dark"
              }
            }}>
            Submit
          </Button>
        </Grow>
      )}
    </Box>
  );
};

export default RegisterForm;
