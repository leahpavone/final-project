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
          backgroundColor: "primary.main",
          borderRadius: "4px",
          padding: 4
        }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            paddingBottom: "30px",
            color: "accent.main"
          }}>
          Login to your account
        </Typography>

        {fieldError ? (
          <Box sx={{ color: theme.palette.error.main, textAlign: "center" }}>
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
            <InputField
              formik={formik}
              name="email"
              label="Email"
              type="text"
              placeholder="Email"
              value={formik.values.email}
            />

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

            <Typography
              variant="caption"
              color={
                formik.touched.password && formik.errors.password
                  ? "error"
                  : "accent.main"
              }>
              {formik.touched.password && formik.errors.password}
            </Typography>

            <Button
              disableRipple
              // variant="contained"
              type="submit"
              disabled={formik.isSubmitting}
              sx={{
                color: "primary.main",
                backgroundColor: "accent.main",
                boxShadow: "none",
                marginTop: "20px",
                "&:hover": {
                  backgroundColor: "accent.dark"
                }
              }}>
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

          <Box sx={{}}>
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
              Don't have an account yet?
            </Typography>
            <Button
              component={Link}
              variant="text"
              sx={{
                backgroundColor: "transparent",
                color: "accent.main",
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
