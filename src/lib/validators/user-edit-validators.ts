import * as yup from "yup";

export const EditUserSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  role: yup.string().oneOf(["super_admin", "artist_manager", "artist"], "Invalid User Role").required("User role is required"),
  dob: yup.date()
    .required("Date of Birth is required")
    .nullable()
    .transform((_, originalValue) => (originalValue ? new Date(originalValue) : null))
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("is-valid-date", "Date of birth must be valid", (value) => value instanceof Date && !isNaN(value.getTime())),
  gender: yup.string()
    .oneOf(["m", "f", "o"], "Invalid gender")
    .required("Gender is required"),
  address: yup.string().required("Address is required")
});
