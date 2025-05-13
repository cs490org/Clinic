import {useState} from "react";
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
import {useNavigate} from "react-router-dom";
import {API_URL} from "../utils/constants";
import {toast} from "sonner";

const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const login = async (event) => {
        event.preventDefault();
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

        if (res.status === 200) {
            const userRes = await fetch(API_URL + '/user', {
                credentials: 'include'
            });

            if (userRes.status === 200) {
                const user = await userRes.json();
                navigate(`/${user.role}/dashboard`, {replace: true});

                // get user response
                window.location.reload()
            } else {
                // WTF
                toast.error("There was an error when fetching  the account.")
                throw new Error("Error while fetching account")
            }
        } else if (res.status === 202) {
            setErrors("Incorrect username/password. Please verify your login credentials and try again.");
        } else {
            setErrors("Login failed. Try reloading the page or opening a new browser window.");
        }
    }

    return (
        <Container maxWidth="xs" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: "80vh"
        }}>
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

                <form onSubmit={login} style={{width: '100%'}}>
                    <Stack spacing={2} sx={{mt: 2}}>
                        <TextField
                            name="email"
                            required
                            fullWidth
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
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
                        />

                        {errors && (
                            <Alert severity="error">
                                {errors}
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
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default SignInPage;