import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Divider,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";

const SPECIALTIES = [
  "Weight Loss",
  "Weight Gain",
  "Nutrition",
  "Physical Therapy"
];

const SignupPage = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const initialUserType = urlParams.get("userType") || "patient";

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [pharmacyZipCode, setPharmacyZipCode] = useState('');

  const [userType, setUserType] = useState(initialUserType);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleUserTypeChange = (event, newValue) => {
    setUserType(newValue);
    setErrors({});
  };

  const register = async () => {
    const res = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (res.status == 200) {
      navigate('/');
    } else if (res.status == 202) {
      // TODO: introduce error displays
      // setError('Account already exists.')
    }
  }


  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.firstName.trim())
  //     newErrors.firstName = "First name is required";
  //   if (!formData.lastName.trim())
  //     newErrors.lastName = "Last name is required";

  //   if (!formData.email.trim()) {
  //     newErrors.email = "Email is required";
  //   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //     newErrors.email = "Email is invalid";
  //   }

  //   if (!formData.password) {
  //     newErrors.password = "Password is required";
  //   } else if (formData.password.length < 8) {
  //     newErrors.password = "Password must be at least 8 characters long";
  //   }

  //   if (formData.password !== formData.confirmPassword) {
  //     newErrors.confirmPassword = "Passwords do not match";
  //   }

  //   if (!formData.agreeToTerms) {
  //     newErrors.agreeToTerms = "You must agree to the terms and conditions";
  //   }

  //   if (userType === "patient") {
  //     if (!formData.address)
  //       newErrors.address = "Address is required";
  //     if (!formData.phone)
  //       newErrors.phone = "Phone number is required";
  //     else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
  //       newErrors.phone = "Please enter a valid 10-digit phone number";
  //   }

  //   if (userType === "doctor") {
  //     if (!formData.specialization)
  //       newErrors.specialization = "Specialization is required";
  //     if (!formData.licenseNumber)
  //       newErrors.licenseNumber = "License number is required";
  //     if (!formData.phone)
  //       newErrors.phone = "Phone number is required";
  //     else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
  //       newErrors.phone = "Please enter a valid 10-digit phone number";
  //   }

  //   if (userType === "pharmacist") {
  //     if (!formData.pharmacyName)
  //       newErrors.pharmacyName = "Pharmacy name is required";
  //     if (!formData.pharmacyAddress)
  //       newErrors.pharmacyAddress = "Pharmacy address is required";
  //     if (!formData.pharmacyPhone)
  //       newErrors.pharmacyPhone = "Pharmacy phone number is required";
  //     else if (!/^\d{10}$/.test(formData.pharmacyPhone.replace(/\D/g, '')))
  //       newErrors.pharmacyPhone = "Please enter a valid 10-digit phone number";
  //     if (!formData.pharmacyZipCode)
  //       newErrors.pharmacyZipCode = "ZIP code is required";
  //     else if (!/^\d{5}(-\d{4})?$/.test(formData.pharmacyZipCode))
  //       newErrors.pharmacyZipCode = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (validateForm()) {
  //     try {
  //       const requestData = {
  //         email: formData.email,
  //         password: formData.password,
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         role: userType.toUpperCase(),
  //       };

  //       if (userType === "patient") {
  //         requestData.address = formData.address;
  //         requestData.phone = formData.phone;
  //       } else if (userType === "doctor") {
  //         requestData.specialty = formData.specialization;
  //         requestData.licenseNumber = formData.licenseNumber;
  //         requestData.phone = formData.phone;
  //       } else if (userType === "pharmacist") {
  //         requestData.pharmacyName = formData.pharmacyName;
  //         requestData.address = formData.pharmacyAddress;
  //         requestData.phone = formData.pharmacyPhone;
  //         requestData.zipCode = formData.pharmacyZipCode;
  //       }

  //       const data = await register(requestData);

  //       switch (data.role) {
  //         case "PATIENT":
  //           navigate("/patient/dashboard");
  //           break;
  //         case "DOCTOR":
  //           navigate("/doctor/dashboard");
  //           break;
  //         case "PHARMACIST":
  //           navigate("/pharmacist/dashboard");
  //           break;
  //         default:
  //           navigate("/dashboard");
  //       }
  //     } catch (error) {
  //       setSubmitError(error.response?.data?.message || "Registration failed");
  //     }
  //   }
  // };

  return (
    <Container maxWidth="sm" sx={{ maxWidth: '700px' }}>
      <Stack
        spacing={3}
        sx={{
          minHeight: '100vh',
          py: 8,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Sign Up
          </Typography>

          <Tabs
            value={userType}
            onChange={handleUserTypeChange}
            variant="fullWidth"
            sx={{ width: '100%', mb: 3 }}
          >
            <Tab label="Patient" value="patient" />
            <Tab label="Doctor" value="doctor" />
            <Tab label="Pharmacist" value="pharmacist" />
          </Tabs>

          <Stack spacing={2} sx={{ width: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="firstName"
                required
                fullWidth
                label="First Name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />

              <TextField
                name="lastName"
                required
                fullWidth
                label="Last Name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Stack>

            <TextField
              name="email"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              name="password"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              error={!!errors.password}
              helperText={errors.password}
            />

            <TextField
              name="confirmPassword"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            {userType === "patient" && (
              <>
                <Divider>Patient Information</Divider>
                <TextField
                  name="address"
                  required
                  fullWidth
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.currentTarget.value)}
                  error={!!errors.address}
                  helperText={errors.address}
                  multiline
                  rows={2}
                />
                <TextField
                  name="phone"
                  required
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.currentTarget.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="(123) 456-7890"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                />
              </>
            )}

            {userType === "doctor" && (
              <>
                <Divider>Doctor Information</Divider>
                <TextField
                  select
                  name="specialization"
                  required
                  fullWidth
                  label="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.currentTarget.value)}
                  error={!!errors.specialization}
                  helperText={errors.specialization}
                >
                  {SPECIALTIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="licenseNumber"
                  required
                  fullWidth
                  label="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.currentTarget.value)}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber}
                />
                <TextField
                  name="phone"
                  required
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.currentTarget.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="(123) 456-7890"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                />
              </>
            )}

            {userType === "pharmacist" && (
              <>
                <Divider>Pharmacy Information</Divider>
                <TextField
                  name="pharmacyName"
                  required
                  fullWidth
                  label="Pharmacy Name"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.currentTarget.value)}
                  error={!!errors.pharmacyName}
                  helperText={errors.pharmacyName}
                />
                <TextField
                  name="pharmacyAddress"
                  required
                  fullWidth
                  label="Pharmacy Address"
                  value={pharmacyAddress}
                  onChange={(e) => setPharmacyAddress(e.currentTarget.value)}
                  error={!!errors.pharmacyAddress}
                  helperText={errors.pharmacyAddress}
                />
                <TextField
                  name="pharmacyPhone"
                  required
                  fullWidth
                  label="Pharmacy Phone Number"
                  value={pharmacyPhone}
                  onChange={(e) => setPharmacyPhone(e.currentTarget.value)}
                  error={!!errors.pharmacyPhone}
                  helperText={errors.pharmacyPhone}
                  placeholder="(123) 456-7890"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                />
                <TextField
                  name="pharmacyZipCode"
                  required
                  fullWidth
                  label="ZIP Code"
                  value={pharmacyZipCode}
                  onChange={(e) => setPharmacyZipCode(e.currentTarget.value)}
                  error={!!errors.pharmacyZipCode}
                  helperText={errors.pharmacyZipCode}
                  placeholder="12345"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9-]*',
                    maxLength: 10
                  }}
                />
              </>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.currentTarget.checked)}
                  color="primary"
                />
              }
              label="I agree to the terms and conditions"
            />
            {errors.agreeToTerms && (
              <Typography color="error" variant="caption">
                {errors.agreeToTerms}
              </Typography>
            )}

            {submitError && (
              <Alert severity="error">
                {submitError}
              </Alert>
            )}

            <Button
              onClick={register}
              fullWidth
              variant="contained"
              size="large"
            >
              Sign Up
            </Button>


          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SignupPage;
