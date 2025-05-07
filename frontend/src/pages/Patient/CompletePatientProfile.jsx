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
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { UserContext } from "../../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys";
import { toast } from 'sonner';

const CompletePatientProfile = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        pharmacyId: '',
        hipaaAgreed: false
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
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.hipaaAgreed) {
            toast.error('You must agree to the HIPAA Privacy Notice to continue');
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
            height: '100vh'
        }}>
            <Paper elevation={3} sx={{ p: 4 }}>
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
                                    <Skeleton />
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

                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    HIPAA Privacy Notice
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    The HIPAA Privacy Rule establishes national standards to protect individuals' medical records and other individually identifiable health information (collectively defined as "protected health information") and applies to health plans, health care clearinghouses, and those health care providers that conduct certain health care transactions electronically.
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    The Rule requires appropriate safeguards to protect the privacy of protected health information and sets limits and conditions on the uses and disclosures that may be made of such information without an individual's authorization.
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    The Rule also gives individuals rights over their protected health information, including rights to:
                                </Typography>
                                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                                    <Typography component="li" variant="body2">Examine and obtain a copy of their health records</Typography>
                                    <Typography component="li" variant="body2">Direct a covered entity to transmit to a third party an electronic copy of their protected health information in an electronic health record</Typography>
                                    <Typography component="li" variant="body2">Request corrections to their health records</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    The Privacy Rule is located at 45 CFR Part 160 and Subparts A and E of Part 164.
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            required
                                            name="hipaaAgreed"
                                            checked={formData.hipaaAgreed}
                                            onChange={handleChange}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            I have read and agree to the HIPAA Privacy Notice
                                        </Typography>
                                    }
                                    sx={{ mt: 2 }}
                                />
                            </Paper>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={!formData.hipaaAgreed}
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