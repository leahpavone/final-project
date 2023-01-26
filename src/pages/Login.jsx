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
  FormHelperText,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginFormSchema } from "../schemas";
import { useFormik } from "formik";
import { CustomTextField } from "./Register";
import { border, useTheme } from "@mui/system";

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
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "primary.main"
      }}>
      <Box
        sx={{
          width: "50%",
          // height: "100%",
          // border: "3px solid",
          backgroundColor: "accent.main",
          borderRadius: "4px",
          padding: 4
        }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", paddingBottom: "30px" }}>
          Login to your account
        </Typography>

        {fieldError ? (
          <Box sx={{ color: theme.palette.error.main }}>{fieldError}</Box>
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
              gap: "10px"
            }}>
            <CustomTextField
              type="email"
              name="email"
              label="Email"
              error={formik.errors.email && formik.touched.email}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.onBlur}
              helperText={formik.touched.email && formik.errors.email}
            />
            <CustomTextField
              error={formik.errors.password && formik.touched.password}
              variant="outlined"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.onBlur}
              id="outlined-adornment-password"
              type={currentPassVisible ? "text" : "password"}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={showCurrentPasswordClick}
                    sx={{
                      color: "primary.main",
                      cursor: "pointer"
                    }}>
                    {currentPassVisible ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                )
              }}
            />
            {formik.errors.password && formik.touched.password ? (
              <FormHelperText error={true}>
                {formik.errors.password}
              </FormHelperText>
            ) : (
              ""
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting}>
              Submit
            </Button>
            <Button
              variant="text"
              sx={{
                backgroundColor: "transparent",
                color: "primary.main",
                width: "fit-content",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline"
                }
              }}
              to={"/forgot-password"}>
              Forgot Password?
            </Button>
          </Box>

          <Divider sx={{ width: "80%", margin: "0 auto" }}>or</Divider>

          <OAuth />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
            <Typography variant="p">Don't have an account yet?</Typography>
            <Button
              component={Link}
              variant="text"
              sx={{
                backgroundColor: "transparent",
                color: "primary.main",
                width: "fit-content",
                fontStyle: "normal",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline"
                }
              }}
              to={"/register"}>
              Create an account
            </Button>
            {/* <Link to="/register">Create an account</Link> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
