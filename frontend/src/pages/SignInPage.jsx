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
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";

const SignInPage = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState('');

  const login = async () => {
    const res = await fetch(API_URL + '/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (res.status == 200) {
      navigate('/', { replace: true });
    } else if (res.status == 202) {
      setErrors("Incorrect username/password. Please verify your login credentials and try again.");
    } else {
      setErrors("Login failed. Try reloading the page or opening a new browser window.");
    }
  }

  const [userType, setUserType] = useState("patient");

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
            // onChange={handleUserTypeChange}
            variant="fullWidth"
            sx={{ width: '100%', mb: 3 }}
          >
            <Tab label="Patient" value="patient" />
            <Tab label="Doctor" value="doctor" />
            <Tab label="Pharmacist" value="pharmacist" />
          </Tabs>

          <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="email"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              error={!!errors.password}
              helperText={errors.password}
            />

            {errors && (
              <Alert severity="error">
                {errors}
              </Alert>
            )}

            <Button
              onClick={login}
              fullWidth
              variant="contained"
              size="large"
            >
              Sign In
            </Button>

          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SignInPage; 