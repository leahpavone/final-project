import { TextField, InputAdornment, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import { styled } from "@mui/system";
import { ErrorOutline } from "@mui/icons-material";

const InputField = ({ formik, name, type, label, placeholder, icon }) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        color={
          formik.touched[name] && formik.errors[name] ? "error" : "accent.main"
        }>
        {label}
      </Typography>

      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={placeholder}
        type={type || "text"}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={Boolean(formik.touched[name] && Boolean(formik.errors[name]))}
        sx={{
          "& .MuiOutlinedInput-root": {
            input: {
              color: "accent.light"
            },
            // "input&.Mui-disabled": {
            //   backgroundColor: "secondary.main",
            //   borderWidth: "2px"
            // },
            "& fieldset": {
              borderColor: "accent.main",
              borderWidth: "2px"
            },
            "&:hover:not(.Mui-error) fieldset ": {
              borderColor: "accent.light",
              borderWidth: "2.5px"
            },
            "&.Mui-focused:not(.Mui-error) fieldset": {
              borderColor: "accent.light",
              borderWidth: "2.5px"
            },
            "&.Mui-error fieldset": {
              borderColor: "error",
              borderWidth: "2px"
            }
            // "&:hover:not(.Mui-disabled) fieldset": {
            //   borderColor: "orange",
            //   border: "5px solid"
            // },
            // "&:hover(.Mui-disabled) fieldset": {
            //   borderColor: "white",
            //   border: "5px solid"
            // }
          },
          "& .MuiSvgIcon-root": {
            color: "accent.main",
            "&:focus": {
              color: "accent.light"
            }
          }
        }}
        InputProps={{
          // startAdornment: formik.touched[name] && formik.errors[name] && (
          //   <InputAdornment position="start" sx={{ cursor: "pointer" }}>
          //     {icon}
          //   </InputAdornment>
          // ),
          endAdornment: formik.touched[name] && formik.errors[name] && (
            <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick>
              {icon}
            </InputAdornment>
          )
        }}
      />

      <Box>
        {formik.touched[name] && formik.errors[name] && (
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
            {formik.touched[name] && formik.errors[name]}
          </Typography>
        )}
      </Box>

      {/* <Typography
        variant="caption"
        color={
          formik.touched[name] && formik.errors[name] ? "error" : "accent.main"
        }>
        {formik.touched[name] && formik.errors[name]}
      </Typography> */}
    </>
  );
};

export default InputField;

export const StyledTextField = styled(TextField)(({ theme }) => ({
  display: "flex",
  flex: 1,
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
    },
    "&:hover": {
      cursor: "pointer"
    }
  }
}));
