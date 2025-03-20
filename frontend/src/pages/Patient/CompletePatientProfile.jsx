import { useContext, useState, useEffect } from 'react';
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
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { UserContext } from "../../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys";

const CompletePatientProfile = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        pharmacyId: ''
    });

    const { data: pharmacies, isLoading: isLoadingPharmacies } = useQuery({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                navigate('/patient/dashboard');
            } 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4}} >
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
                            />

                            <TextField
                                required
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                multiline
                                rows={2}
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