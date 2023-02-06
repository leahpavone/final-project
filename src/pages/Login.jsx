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
  Container
} from "@mui/material";
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { loginFormSchema } from "../schemas";
import { useFormik } from "formik";
// import { useTheme } from "@mui/system";
import InputField from "../components/InputField";
import UserContext from "../context/UserContext";
import NoUserDrawer from "../components/NoUserDrawer";
import { PageSpinner } from "../components/Spinners";

const Login = () => {
  const [fieldError, setFieldError] = useState("");
  const [currentPassVisible, setCurrentPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    setLoading(true);
    console.log(values, actions);
    const { email, password } = values;
    // actions.resetForm();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log(values, actions);
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
  console.log(formik);

  // how to delete password

  useEffect(() => {
    if (currentUser) {
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
            textAlign: "center",
            paddingBottom: "20px",
            fontSize: { xs: "32px", lg: "48px" },
            fontWeight: 600,
            pb: 8
          }}>
          Login to your account
        </Typography>

        {fieldError ? (
          <Box
            sx={{
              color: "error.main",
              fontSize: { xs: "16px", lg: "18px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
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
    </Container>
  );
};

export default Login;
