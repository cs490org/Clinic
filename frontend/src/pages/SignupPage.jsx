import {useState} from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Tabs,
    Tab,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../utils/constants";


const SignupPage = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const initialUserType = urlParams.get("role") || "PATIENT";

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userType, setUserType] = useState(initialUserType);

    const [errors, setErrors] = useState({});

    const handleUserTypeChange = (event, newValue) => {
        setUserType(newValue);
        setErrors({});
    };

    const register = async (event) => {
        event.preventDefault();
        const res = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: userType.toUpperCase()
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (res.status == 200) {
            navigate(`/${userType.toLowerCase()}/dashboard`);
        } else if (res.status == 202) {
            // TODO: introduce error displays
            // setError('Account already exists.')
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{p: 4}}
            >
                <Stack alignItems={"center"}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Sign Up
                    </Typography>

                    <Tabs
                        value={userType}
                        onChange={handleUserTypeChange}
                        variant="fullWidth"
                        sx={{width: '100%', mb: 3}}
                    >
                        <Tab label="Patient" value="PATIENT"/>
                        <Tab label="Doctor" value="DOCTOR"/>
                        <Tab label="Pharmacist" value="PHARMACIST"/>
                    </Tabs>

                    <form onSubmit={register} style={{width: '100%'}}>
                        <Stack spacing={2} sx={{width: '100%'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
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
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                            />


                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Container>
    );
};

export default SignupPage;
