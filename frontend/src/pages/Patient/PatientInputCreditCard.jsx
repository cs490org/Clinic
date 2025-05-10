import { useContext, useState } from "react";
import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { toast } from "sonner";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants.js";

const PatientInputCreditCard = () => {
    const { roleData } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        patientId: roleData.id,
        cardHolderName: "",
        cardNumber: "",
        expirationDate: "",
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        const cardNumberRegex = /^\d{13,19}$/;
        const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const zipRegex = /^\d{5}$/;

        if (!formData.cardHolderName.trim()) errors.cardHolderName = "Cardholder name is required";
        if (!cardNumberRegex.test(formData.cardNumber.replace(/\s+/g, ""))) errors.cardNumber = "Invalid card number";
        if (!expirationRegex.test(formData.expirationDate)) errors.expirationDate = "Format must be MM/YY";
        if (!formData.street.trim()) errors.street = "Street address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!zipRegex.test(formData.zip)) errors.zip = "ZIP must be 5 digits";

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        const billingAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;

        const submission = {
            patientId: formData.patientId,
            cardHolderName: formData.cardHolderName,
            cardNumber: formData.cardNumber,
            expirationDate: formData.expirationDate,
            billingAddress,
        };

        try {
            const res = await fetch(API_URL + "/credit-cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(submission),
            });

            if (!res.ok) throw new Error("Failed to save card");
            navigate("/patient/symptoms");
            toast.success("Card saved!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save credit card");
        }
    };

    return (
        <Container>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" mb={2}>Enter payment information</Typography>
                <Stack spacing={2}>
                    <TextField
                        name="cardHolderName"
                        label="Cardholder Name"
                        fullWidth
                        required
                        value={formData.cardHolderName}
                        onChange={handleChange}
                        error={!!formErrors.cardHolderName}
                        helperText={formErrors.cardHolderName}
                    />
                    <TextField
                        name="cardNumber"
                        label="Card Number"
                        fullWidth
                        required
                        inputProps={{ maxLength: 19 }}
                        value={formData.cardNumber}
                        onChange={handleChange}
                        error={!!formErrors.cardNumber}
                        helperText={formErrors.cardNumber}
                    />
                    <TextField
                        name="expirationDate"
                        label="Expiration Date (MM/YY)"
                        fullWidth
                        required
                        value={formData.expirationDate}
                        onChange={handleChange}
                        error={!!formErrors.expirationDate}
                        helperText={formErrors.expirationDate}
                    />
                    <TextField
                        name="street"
                        label="Street Address"
                        fullWidth
                        required
                        value={formData.street}
                        onChange={handleChange}
                        error={!!formErrors.street}
                        helperText={formErrors.street}
                    />
                    <TextField
                        name="city"
                        label="City"
                        fullWidth
                        required
                        value={formData.city}
                        onChange={handleChange}
                        error={!!formErrors.city}
                        helperText={formErrors.city}
                    />
                    <TextField
                        name="state"
                        label="State"
                        fullWidth
                        required
                        value={formData.state}
                        onChange={handleChange}
                        error={!!formErrors.state}
                        helperText={formErrors.state}
                    />
                    <TextField
                        name="zip"
                        label="ZIP Code"
                        fullWidth
                        required
                        inputProps={{ maxLength: 5 }}
                        value={formData.zip}
                        onChange={handleChange}
                        error={!!formErrors.zip}
                        helperText={formErrors.zip}
                    />
                    <Button type="submit" variant="contained">Save Card</Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default PatientInputCreditCard;
