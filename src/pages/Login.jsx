import { useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utilities/firebase";
import { useNavigate, Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { loginFormSchema } from "../schemas";
import { useFormik } from "formik";
import InputField from "../components/InputField";
import UserContext from "../context/UserContext";
import NoUserDrawer from "../components/NoUserDrawer";
import AccountMenu from "../components/AccountMenu";
import { PageSpinner } from "../components/Spinners";
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Container,
  Fade
} from "@mui/material";

const Login = () => {
  const [fieldError, setFieldError] = useState("");
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    setLoading(true);
    const { email, password } = values;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log(error);
      const code = error.code;
      const message = error.message;
      console.error({ code, message });

      if (error.code === "auth/user-not-found") {
        setFieldError("User not found");
        setLoading(false);
      }
      if (error.code === "auth/wrong-password") {
        setFieldError("Invalid password");
        setLoading(false);
      }
    }
  };

  const showCurrentPasswordClick = async () => {
    setCurrentPassVisible(!currentPassVisible);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: loginFormSchema,
    onSubmit
  });

  // useEffect(() => {
  //   if (currentUser !== null) {
  //     navigate("/dashboard");
  //   }
  // }, [currentUser, navigate]);

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
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "70%", md: "50%", lg: "40%" },
            minHeight: "100%",
            borderRadius: "4px",
            ml: { xs: 0, md: "220px" }
          }}>
          <Typography
            variant="h4"
            sx={{
              height: "100%",
              textAlign: "center",
              paddingBottom: "20px",
              fontSize: { xs: "30px", lg: "40px" },
              fontWeight: 600,
              pt: { xs: 4, sm: 3, md: 2, lg: 1 },
              pb: 8
            }}>
            Login to your account
          </Typography>

          {fieldError ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                color: "error.main",
                fontSize: { xs: "16px", lg: "18px" },
                letterSpacing: "1px",
                fontWeight: "500",
                pb: 4
              }}>
              <ErrorOutline sx={{ height: "18px", width: "18px" }} />
              {fieldError}
            </Box>
          ) : (
            ""
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column" },
                gap: { xs: "10px", lg: "20px" }
              }}>
              <Box width="100%">
                <InputField
                  formik={formik}
                  name="email"
                  label="Email"
                  type="text"
                  placeholder="Email"
                  value={formik.values.email}
                />
              </Box>

              <Box width="100%">
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
            </Box>

            <Button
              component={Link}
              variant="text"
              sx={{
                width: "fit-content",
                height: "fit-content",
                p: 0,
                mt: "-5px"
              }}
              to={"/forgot-password"}>
              Forgot Password?
            </Button>
            <Button
              disableRipple
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting}
              sx={{
                marginTop: "20px"
              }}>
              Submit
            </Button>
          </Box>

          <OAuth />
        </Box>
      </Fade>
    </Container>
  );
};

export default Login;
