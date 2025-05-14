
import {useContext, useEffect, useState} from "react";

import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {API_URL, PHARMACY_API_URL} from "../../utils/constants.js";
import { toast } from "sonner";
import { UserContext } from "../../contexts/UserContext.jsx";

const pharmacyOptions = [
    "CVS Pharmacy",
    "Walgreens",
    "Rite Aid",
    "Kroger Pharmacy",
    "Walmart Pharmacy",
    "Costco Pharmacy",
    "Publix Pharmacy",
    "Safeway Pharmacy",
    "Albertsons Pharmacy",
    "Sam's Club Pharmacy",
    "H-E-B Pharmacy",
    "Target Pharmacy",
];

const CompletePharmacyProfile = () => {
    const navigate = useNavigate();

    const {user} = useContext(UserContext);
    useEffect(() => {
        const run = async () => {
            const res = await fetch(PHARMACY_API_URL + `/pharmacies?userId=${user.id}`)
            if(res.ok){
                navigate("/pharmacist/dashboard")
            }
        }
        run()
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        zipCode: "",
        phone: "",
        address: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim() || formData.name.length < 2) {
            newErrors.name = "Pharmacy name must be at least 2 characters.";
        }

        if (!/^\d{5}$/.test(formData.zipCode)) {
            newErrors.zipCode = "Zip code must be 5 digits.";
        }

        if (!/^\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 to 15 digits.";
        }

        if (!/^\d+\s[a-zA-Z\s]+,\s[a-zA-Z]+,\s[A-Z]{2}$/.test(formData.address)) {
            newErrors.address = "Invalid address format. Please enter a valid address ex.\"123 Main Ave, Newark, NJ \"";
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
            const response = await fetch(PHARMACY_API_URL + "/pharmacies", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId: user.id,
                    ...formData,
                }),
            });

            if (response.ok) {
                toast.success("Profile created successfully!");
                navigate("/pharmacist/dashboard", { replace: true });
                window.location.reload();
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to create profile.");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the form.");
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Complete Pharmacist Profile
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Autocomplete
                            freeSolo
                            options={pharmacyOptions}
                            value={formData.name}
                            onChange={(event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    name: newValue || "",
                                }));
                                setErrors((prev) => ({
                                    ...prev,
                                    name: "",
                                }));
                            }}
                            onInputChange={(event, newInputValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    name: newInputValue,
                                }));
                                setErrors((prev) => ({
                                    ...prev,
                                    name: "",
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pharmacy Name"
                                    fullWidth
                                    required
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            )}
                        />

                        <TextField
                            name="zipCode"
                            required
                            fullWidth
                            label="Zip Code"
                            value={formData.zipCode}
                            onChange={handleChange}
                            error={!!errors.zipCode}
                            helperText={errors.zipCode}
                        />

                        <TextField
                            name="phone"
                            required
                            fullWidth
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />

                        <TextField
                            name="address"
                            required
                            fullWidth
                            label="Address"
                            value={formData.address}
                            onChange={handleChange}
                            error={!!errors.address}
                            helperText={errors.address}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                        >
                            Complete Profile
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default CompletePharmacyProfile;
