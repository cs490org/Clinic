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
    Checkbox, Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { UserContext } from "../../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys";
import { toast } from 'sonner';
import PatientSymptoms from "./PatientSymptoms.jsx";
import PatientInputCreditCard from "./PatientInputCreditCard.jsx";

const CompletePatientProfile = () => {
    const navigate = useNavigate();
    const { user} = useContext(UserContext);

    useEffect(() => {
        const run = async () => {
            const res = await fetch(API_URL + `/patients?userId=${user.id}`)
            // already have patient with that user id
            if(res.ok){
                navigate("/patient/dashboard")
            }
        }
        run()
    }, []);

    const [formData, setFormData] = useState({
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        pharmacyId: '',
        hipaaAgreed: false
    });

    const [errors, setErrors] = useState("");

    const { data: pharmacies, isLoading: isLoadingPharmacies } = useQuery({
        queryKey: queryKeys.pharmacies.all,
        queryFn: async () => {
            const res = await fetch(API_URL + '/pharmacies', {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch pharmacies');
            return res.json();
        },
    });



    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.phone.match(/^\d{10,15}$/)) {
            newErrors.phone = "Phone must be 10 to 15 digits.";
        }

        if (!formData.zipCode.match(/^\d{5}$/)) {
            newErrors.zipCode = "ZIP code must be exactly 5 digits.";
        }
        if (!formData.state.match(/^[A-Z]{2}$/)) {
            newErrors.state = "State must be a 2-letter uppercase code.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validateForm()) {
            toast.error("Please correct the highlighted fields.");
            return
        }
      
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
                    phone: formData.phone,
                    address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
                    pharmacyId: formData.pharmacyId,
                    hipaaAgreed: formData.hipaaAgreed,
                    userId: user.id
                }),

                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Profile completed successfully!');
                // navigate('/patient/dashboard');
                // navigate('/patient/symptoms');
                navigate('/patient/add_payment');

                // ensure we get role info
                window.location.reload()
            }
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <Container maxWidth="lg" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
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
                        <Stack spacing={2} alignItems={"center"}>
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
                                label="Street Address"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="State (e.g., NY)"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={!!errors.state}
                                helperText={errors.state}
                            />
                            <TextField
                                required
                                fullWidth
                                label="ZIP Code"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                error={!!errors.zipCode}
                                helperText={errors.zipCode}
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
                                Next
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Container>
    );
};

export default CompletePatientProfile; 