"use client";

// most of this was ai generated:/
// going to create a signin page thats going to work like this

// Upon submitting, JSON object will contain ALL data
// to determine what values to read, userType field will containg either patient, doctor, or pharmacist
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";

const SignupPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialUserType = urlParams.get("userType") || "patient";

  const [userType, setUserType] = useState(initialUserType);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // Additional fields for different user types
    // DOCTORS
    specialization: "", // TODO: Dropdown for specialization types
    licenseNumber: "",

    // PHARMACY
    pharmacyName: "",
    pharmacyAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleUserTypeChange = (event, newValue) => {
    setUserType(newValue);
    setErrors({});
    setSubmitSuccess(false);
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "agreeToTerms" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    // Validate user type specific fields
    if (userType === "doctor") {
      if (!formData.specialization)
        newErrors.specialization = "Specialization is required";
      if (!formData.licenseNumber)
        newErrors.licenseNumber = "License number is required";
    }

    if (userType === "pharmacist") {
      if (!formData.pharmacyName)
        newErrors.pharmacyName = "Pharmacy name is required";
      if (!formData.pharmacyAddress)
        newErrors.pharmacyAddress = "Pharmacy address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      // send form data to backend here
      console.log("Form submitted:", { userType, ...formData });
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        specialization: "",
        licenseNumber: "",
        pharmacyName: "",
        pharmacyAddress: "",
      });
    }
  };

  return (
    <Container sx={{ mt: "10rem" }} maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mb: 3 }}
        >
          <Tabs
            value={userType}
            onChange={handleUserTypeChange}
            aria-label="user type tabs"
          >
            <Tab label="Patient" value="patient" />
            <Tab label="Doctor" value="doctor" />
            <Tab label="Pharmacist" value="pharmacist" />
          </Tabs>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                label="First Name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>

            {userType === "doctor" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    name="specialization"
                    required
                    fullWidth
                    label="Specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    error={!!errors.specialization}
                    helperText={errors.specialization}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="licenseNumber"
                    required
                    fullWidth
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber}
                  />
                </Grid>
              </>
            )}

            {userType === "pharmacist" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    name="pharmacyName"
                    required
                    fullWidth
                    label="Pharmacy Name"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    error={!!errors.pharmacyName}
                    helperText={errors.pharmacyName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="pharmacyAddress"
                    required
                    fullWidth
                    label="Pharmacy Address"
                    value={formData.pharmacyAddress}
                    onChange={handleChange}
                    error={!!errors.pharmacyAddress}
                    helperText={errors.pharmacyAddress}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    color="primary"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                }
                label="I agree to the terms and conditions"
              />
              {errors.agreeToTerms && (
                <Typography color="error" variant="caption" display="block">
                  {errors.agreeToTerms}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        {submitSuccess && (
          <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
            Signup successful! Welcome aboard.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default SignupPage;
