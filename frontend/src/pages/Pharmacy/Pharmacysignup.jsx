import {
    Container,
    Typography,
    Stack,
    TextField,
    Button,
    Box
} from '@mui/material';
import { useState } from 'react';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';

const PharmacySignup = () => {
    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/pharmacies/signup`, form, {
                withCredentials: true,
            });
            toast.success('Pharmacy signed up successfully');
            // Optionally reset form
            setForm({ name: '', address: '', email: '', password: '' });
        } catch (err) {
            toast.error('Signup failed');
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Stack spacing={3}>
                <Typography fontWeight="bold" sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem' } }}>
                    Pharmacy Signup
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}
                >
                    <TextField
                        label="Pharmacy Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <Button type="submit" variant="contained">
                        Sign Up
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
};

export default PharmacySignup;

