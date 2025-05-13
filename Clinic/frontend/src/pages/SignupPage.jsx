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
import {toast} from "sonner";


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

    const validate = () => {
        const newErrors = {};
        // one or more characters, @ symbol, one or more characters, period, one or more characters.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email address.";
        }

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            newErrors.password = "Password must include letters and numbers.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUserTypeChange = (event, newValue) => {
        setUserType(newValue);
        setErrors({});
    };

    const register = async (event) => {
        event.preventDefault();
        if(!validate()) return;
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
            const userRes = await fetch(API_URL + '/user', {
                credentials: 'include'
            });

            if (userRes.status === 200) {
                // get user response
                window.location.reload();
            } else {
                // WTF
                toast.error("There was an error when creating the account.")
                throw new Error("Error while creating account")
            }

        } else if (res.status == 202) {
            // TODO: introduce error displays
            // setError('Account already exists.')
            toast.error(`An account with the email \"${email}\" already exists.`)
        }
    }

    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
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
                                />

                                <TextField
                                    name="lastName"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.currentTarget.value)}
                                />
                            </Stack>

                            <TextField
                                name="email"
                                required
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                error={errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                name="password"
                                required
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                error={errors.password}
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
