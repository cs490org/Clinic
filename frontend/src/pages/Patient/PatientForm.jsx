import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { patientSchema } from "./patientSchema";
import { useAuth } from "../../auth/AuthProvider";

function PatientForm() {
  const { token, setToken } = useAuth();
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      name: "",
      phone: "",
      address: "",
      password: "",
    },
    validationSchema: patientSchema,
    onSubmit: async (values, actions) => {
      //send api request to login user here.

      alert(JSON.stringify(values, null, 2) + "mock set token for the user");

      // for now, we will set dummy values for the user token.
      setToken("patient");

      actions.resetForm();
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <Box
        mt="2rem"
        width="100%"
        display="flex"
        flexDirection={"column"}
        gap="0.5rem"
      >
        <TextField
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          id="name"
          type="text"
          label="Name"
          error={errors.name && touched.name}
          helperText={touched.name && errors.name}
        />
        <TextField
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          id="phone"
          type="tel"
          label="Phone"
          error={errors.phone && touched.phone}
          helperText={touched.phone && errors.phone}
        />
        <TextField
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          id="address"
          type="text"
          label="Address"
          error={errors.address && touched.address}
          helperText={touched.address && errors.address}
          multiline
          rows={3}
        />
        <TextField
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          id="password"
          type="password"
          label="Password"
          error={errors.password && touched.password}
          helperText={touched.password && errors.password}
        />
        <Button type="submit">Submit</Button>
        {/**
         * TODO: ADD INSURANCE INFO AND PAYMENTS ONLINE (CREDIT INFO)
         */}
      </Box>
    </form>
  );
}

export default PatientForm;
