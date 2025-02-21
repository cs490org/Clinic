import * as yup from "yup";
// for form validateion
export const patientSchema = yup.object().shape({
  name: yup.string().required("Required"),
  phone: yup.number().required("Required"),
  address: yup.string().required("Required"),
  password: yup.string().required("Required"),
});
