import { TextField, InputAdornment, Typography, Box } from "@mui/material";
import { useFormik } from "formik";

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
      {/* <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder={placeholder}
        type={type || "text"}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={Boolean(formik.touched[name] && Boolean(formik.errors[name]))}
        // helperText={formik.touched[name] && formik.errors[name]}
        // sx={{
        //   borderRadius: "4px",
        //   "& fieldset": {
        //     borderColor: (theme) => theme.palette.primary.main,
        //     borderWidth: "2px",

        //     "& .Mui-error fieldset": {
        //       borderColor: (theme) => theme.palette.secondary.main,
        //       borderWidth: "2.5px"
        //     }
        //   }
        // }}
        InputProps={{
          sx: styles.textField

          // endAdornment: (
          //   <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick>
          //     {icon}
          //   </InputAdornment>
          // )
        }}
      /> */}

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
        // helperText={Boolean(
        //   formik.touched[name] && Boolean(formik.errors[name])
        // )}
        sx={{
          "& .MuiOutlinedInput-root": {
            input: {
              color: "accent.light"
            },
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
          },
          "& .MuiSvgIcon-root": {
            color: "accent.main",
            "&.Mui-focused": {
              color: "accent.light"
            }
          }
        }}
        // InputProps={{
        //   startAdornment: formik.touched[name] && formik.errors[name] && (
        //     <InputAdornment position="start" sx={{ cursor: "pointer" }}>
        //       {icon}
        //     </InputAdornment>
        //   )
        // }}
      />

      <Typography
        variant="caption"
        color={
          formik.touched[name] && formik.errors[name] ? "error" : "accent.main"
        }>
        {formik.touched[name] && formik.errors[name]}
      </Typography>
    </>
  );
};

export default InputField;

// export const CustomTextField = styled(TextField)(({ theme }) => ({
//   "& label": {
//     color: theme.palette.accent.main
//   },
//   "& label.Mui-focused": {
//     color: theme.palette.accent.dark,
//     "&.Mui-error": {
//       color: theme.palette.error.main
//     }
//   },
//   "& .MuiOutlinedInput-root": {
//     input: {
//       color: theme.palette.accent.dark
//     },
//     "& fieldset": {
//       borderColor: theme.palette.accent.main,
//       borderWidth: "2px"
//     },
//     "&:hover:not(.Mui-error) fieldset ": {
//       borderColor: theme.palette.accent.dark,
//       borderWidth: "2px"
//     },
//     "&.Mui-focused:not(.Mui-error) fieldset": {
//       borderColor: theme.palette.accent.dark,
//       borderWidth: "2.5px"
//     },
//     "&.Mui-error fieldset": {
//       borderColor: theme.palette.error,
//       borderWidth: "2.5px"
//     }
//   },
//   "& .MuiSvgIcon-root": {
//     color: theme.palette.accent.main,
//     "&.Mui-focused": {
//       color: theme.palette.accent.dark
//     }
//   }
// }));
