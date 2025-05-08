import {useState} from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../../utils/constants";
import {toast} from "sonner";
import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext";
import { MenuItem } from "@mui/material";

const CompleteDoctorProfile = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const [formData, setFormData] = useState({
        phone: "",
        specialty: "",
        licenseNumber: "",
    });
    const [errors, setErrors] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const specialties = [
        "Allergy and Immunology",
        "Anesthesiology",
        "Cardiology",
        "Dermatology",
        "Emergency Medicine",
        "Endocrinology",
        "Family Medicine",
        "Gastroenterology",
        "General Surgery",
        "Geriatrics",
        "Hematology",
        "Internal Medicine",
        "Nephrology",
        "Neurology",
        "Obstetrics and Gynecology",
        "Oncology",
        "Ophthalmology",
        "Orthopedics",
        "Otolaryngology (ENT)",
        "Pediatrics",
        "Plastic Surgery",
        "Psychiatry",
        "Pulmonology",
        "Radiology",
        "Rheumatology",
        "Urology",
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.phone.match(/^\d{10,15}$/)) {
            newErrors.phone = "Phone must be 10 to 15 digits.";
        }

        if (!formData.specialty.trim()) {
            newErrors.specialty = "Specialty is required.";
        }

        if (!formData.licenseNumber.match(/^MD-[a-zA-Z0-9]{6,}$/)) {
            newErrors.licenseNumber =
                "License must start with 'MD-' and have at least 6 alphanumeric characters. Note no special characters allowed after MD-.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please input valid data as shown.");
            return;
        }
        try {
            const response = await fetch(API_URL + "/doctors", {
                method: "POST",
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
                navigate("/doctor/dashboard", {replace: true});

                // ensure we get role info
                window.location.reload()

            } else {
                const data = await response.text()
                toast.error(data)
            }
        } catch (error) {
            toast.error("There was an error when creating the doctor.")
        }
    };

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
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Complete Doctor Profile
                </Typography>

                <form onSubmit={handleSubmit} style={{width: "100%"}}>
                    <Stack spacing={2} sx={{mt: 2}}>


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
                            name="specialty"
                            required
                            select
                            fullWidth
                            label="Specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            error={!!errors.specialty}
                            helperText={errors.specialty}
                        >
                            {specialties.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            name="licenseNumber"
                            required
                            fullWidth
                            label="License Number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            error={!!errors.licenseNumber}
                            helperText={errors.licenseNumber}
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

export default CompleteDoctorProfile; 