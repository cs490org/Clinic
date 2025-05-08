import {useContext, useState, useEffect} from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../../utils/constants";
import {UserContext} from "../../contexts/UserContext";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys";
import {toast} from 'sonner';

const CompletePatientProfile = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        pharmacyId: ''
    });
    const [errors, setErrors] = useState("");

    const {data: pharmacies, isLoading: isLoadingPharmacies} = useQuery({
        queryKey: queryKeys.pharmacies.all,
        queryFn: async () => {
            const res = await fetch(API_URL + '/pharmacies', {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch pharmacies');
            return res.json();
        }
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.phone.match(/^\d{10,15}$/)) {
            newErrors.phone = "Phone must be 10 to 15 digits.";
        }

        if (!/^\d+\s[a-zA-Z\s]+,\s[a-zA-Z]+,\s[A-Z]{2},\s\d{5}$/.test(formData.address)) {
            newErrors.address = "Invalid address format. Please enter a valid address ex.\"123 Main Ave, Newark, NJ, 07024 \"";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please correct the highlighted fields.");
            return;
        }
        try {
            // Create patient profile with associated userId and pharmacyId
            const res = await fetch(API_URL + '/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user.id
                }),
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Profile completed successfully!');
                navigate('/patient/dashboard');

                // ensure we get role info
                window.location.reload()
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <Paper elevation={3} sx={{p: 4}}>
                <Stack spacing={2}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Welcome {user.firstName}! Your profile is almost complete.
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Please provide your information to complete your patient profile.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                required
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />

                            <TextField
                                required
                                fullWidth
                                label="Address, City, State, ZIP code"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                            />

                            <FormControl fullWidth required>
                                <InputLabel>Preferred Pharmacy</InputLabel>
                                {isLoadingPharmacies ? (
                                    <Skeleton/>
                                ) : (
                                    <Select
                                        name="pharmacyId"
                                        value={formData.pharmacyId}
                                        onChange={handleChange}
                                        label="Preferred Pharmacy"
                                    >
                                        {pharmacies?.map((pharmacy) => (
                                            <MenuItem key={pharmacy.id} value={pharmacy.id}>
                                                {pharmacy.name} - {pharmacy.address} - {pharmacy.zipCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                            >
                                Complete Profile
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Container>
    );
};

export default CompletePatientProfile; 