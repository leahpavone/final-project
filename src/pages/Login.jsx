import { useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utilities/firebase";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import OAuth from "../components/OAuth";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Divider,
  Container
} from "@mui/material";
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { loginFormSchema } from "../schemas";
import { useFormik } from "formik";
import { useTheme } from "@mui/system";
import InputField from "../components/InputField";

const Login = () => {
  const [fieldError, setFieldError] = useState("");
  const [currentPassVisible, setCurrentPassVisible] = useState(false);

  const theme = useTheme();

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    console.log(values, actions);
    const { email, password } = values;
    // actions.resetForm();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.log(values, actions);
      console.log(error);
      const code = error.code;
      const message = error.message;
      console.error({ code, message });
      // setLoading(false);

      if (error.code === "auth/user-not-found") {
        setFieldError("User not found");
      }
      if (error.code === "auth/wrong-password") {
        setFieldError("Invalid password");
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
  console.log(formik);

  // how to delete password

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <Container
      maxWidth="100vw"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "primary.main",
        pt: 4,
        pb: 4
      }}>
      <Box
        sx={{
          width: { xs: "80%", md: "70%", lg: "60%" },
          backgroundColor: "primary.main",
          borderRadius: "4px"

          // p: 3
        }}>
        <Typography
          variant="h4"
          sx={{
            color: "accent.main",
            textAlign: "center",
            paddingBottom: "30px",
            fontSize: { xs: "32px", lg: "48px" },
            fontWeight: 600
          }}>
          Login to your account
        </Typography>

        {fieldError ? (
          <Box
            sx={{
              color: theme.palette.error.main,
              fontSize: { xs: "16px", lg: "18px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              letterSpacing: "1px",
              fontWeight: "500"
            }}>
            <ErrorOutline sx={{ height: "18px", width: "18px" }} />
            {fieldError}
          </Box>
        ) : (
          ""
        )}
        <Box>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "fit-content",
              gap: "10px"
            }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
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

          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
            <Box sx={{ pt: "24px" }}>
              <Divider
                sx={{
                  color: "rgba(181, 155, 202, 0.5)",
                  width: "95%",
                  margin: "0 auto",
                  "&::before": {
                    borderTop: "thin solid rgba(181, 155, 202, 0.5)"
                  },
                  "&::after": {
                    borderTop: "thin solid rgba(181, 155, 202, 0.5)"
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
              <Typography
                variant="subtitle1"
                sx={{ color: "rgba(181, 155, 202, 0.7)" }}>
                Don't have an account yet?
              </Typography>
              <Button
                component={Link}
                variant="text"
                sx={{ fontSize: "16px", letterSpacing: "1px", p: 0 }}
                to={"/register"}>
                Create an account
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
