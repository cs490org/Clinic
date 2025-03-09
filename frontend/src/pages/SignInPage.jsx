"use client";

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
} from "@mui/material";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link as RouterLink } from "react-router";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleUserTypeChange = (event, newValue) => {
    setUserType(newValue);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        // Mock login until backend is ready
        const data = await login(formData.email, formData.password, userType.toUpperCase());
        
        // Navigate based on role
        switch (data.role) {
          case "PATIENT":
            navigate("/patient/dashboard");
            break;
          case "DOCTOR":
            navigate("/doctor/dashboard");
            break;
          case "PHARMACIST":
            navigate("/pharmacist/dashboard");
            break;
          default:
            navigate("/");
        }
      } catch (error) {
        setSubmitError("Invalid credentials");
      }
    }
  };

  return (
    <Container maxWidth="xs">
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
            Sign In
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

          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="email"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              name="password"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />

            {submitError && (
              <Alert severity="error">
                {submitError}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              Sign In
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2 }}
            >
              Don't have an account?{' '}
              <RouterLink
                to={`/signup?userType=${userType}`}
                style={{
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                Sign up
              </RouterLink>
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SignInPage; 