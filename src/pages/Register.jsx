import { useState, useContext, useEffect, useRef } from "react";
import { auth } from "../utilities/firebase";
import axios from "axios";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  updateProfile
} from "firebase/auth";
import AuthContext from "../context/AuthContext";
import OAuth from "../components/OAuth";
import {
  Visibility,
  VisibilityOff,
  ErrorOutline,
  AccountBalance
} from "@mui/icons-material";
import {
  Button,
  Typography,
  InputAdornment,
  TextField,
  Box,
  Grid,
  Container
} from "@mui/material";
import { registerFormSchema } from "../schemas";
import { useFormik } from "formik";
import InputField from "../components/InputField";
import NoUserDrawer from "../components/NoUserDrawer";
import { PageSpinner } from "../components/Spinners";
import AccountMenu from "../components/AccountMenu";

const Register = () => {
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  const [userBirthday, setUserBirthday] = useState(null);
  const [loading, setLoading] = useState(false);

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
      console.log("profile added");
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

  useEffect(() => {
    if (currentUser !== null) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        minHeight: "100vh",
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 4,
        pb: 4
      }}>
      <NoUserDrawer />
      <AccountMenu />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "80%", md: "70%", lg: "60%" },
          minHeight: "100%",
          borderRadius: "4px",
          ml: { xs: 0, md: "220px" }
        }}>
        <Typography
          variant="h4"
          sx={{
            height: "100%",
            color: "accent.main",
            textAlign: "center",
            paddingBottom: "20px",
            fontSize: { xs: "32px", lg: "48px" },
            fontWeight: 600,
            pb: 8
          }}>
          Create an Account
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
            gap: "30px"
          }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputField
                formik={formik}
                name="name"
                label="Name"
                type="text"
                placeholder="Full name"
                value={formik.values.name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputField
                formik={formik}
                name="email"
                label="Email"
                type="email"
                placeholder="janedoe@gmail.com"
                value={formik.values.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputField
                formik={formik}
                name="phoneNumber"
                label="Phone number"
                type="text"
                placeholder="xxx-xxx-xxxx"
                value={formik.values.phoneNumber}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                      error={formik.touched.birthday && formik.errors.birthday}
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
            </Grid>

            <Grid item xs={12} md={6}>
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
                error={formik.errors.password && formik.touched.password}
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
                      {currentPassVisible ? <Visibility /> : <VisibilityOff />}
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
            </Grid>

            <Grid item xs={12} md={6}>
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

        <OAuth />
      </Box>
    </Container>
  );
};

export default Register;
