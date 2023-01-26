import * as yup from "yup";
import dayjs from "dayjs";

// min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const registerFormSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  phoneNumber: yup.number().required("Required"),
  birthday: yup
    .date()
    .typeError("Please enter a valid date")
    .min(new Date(1900, 0, 1), "Please enter a valid date")
    .required("Required"),
  password: yup
    .string()
    .min(6)
    .matches(passwordRules, {
      message:
        "Password must contain at least: 1 uppercase character, 1 lowercase character, and 1 numeric character."
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required")
});

// formatBirthday(registerFormSchema.birthday);

export const loginFormSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required")
});

export const updateNameEmailFormSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Please enter a valid email").required("Required")
});
