import React, { useState } from 'react';
import {
    Button, TextField, Stack, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import {API_URL} from "../../utils/constants.js";

export default function PatientAddAppointmentData({ open, onClose, patientId,appointmentId }) {
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        waterIntake: '',
        bloodPressure: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.height || formData.height <= 0) newErrors.height = "Enter a valid height";
        if (!formData.weight || formData.weight <= 0) newErrors.weight = "Enter a valid weight";
        if (!formData.waterIntake || formData.waterIntake <= 0) newErrors.waterIntake = "Enter a valid water intake";
        if (!formData.bloodPressure || !/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure))
            newErrors.bloodPressure = "Format must be like 120/80";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['weight', 'height', 'waterIntake'];

        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? parseFloat(value) || '' : value
        }));

        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const payload = {
                appointmentId: parseInt(appointmentId),
                patientId,
                ...formData,
                date: new Date().toISOString() // Auto-fill current date/time
            };
            console.log(payload)
            await axios.post(API_URL+'/patient/appointment-data', payload,{withCredentials:true});
            onClose(true); // success
        } catch (err) {
            console.error("Submission failed:", err);
            onClose(false); // failure
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
            <DialogTitle>Submit Appointment Data</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        name="height"
                        label="Height (cm)"
                        type="number"
                        fullWidth
                        value={formData.height}
                        onChange={handleChange}
                        error={!!errors.height}
                        helperText={errors.height}
                    />
                    <TextField
                        name="weight"
                        label="Weight (kg)"
                        type="number"
                        fullWidth
                        value={formData.weight}
                        onChange={handleChange}
                        error={!!errors.weight}
                        helperText={errors.weight}
                    />
                    <TextField
                        name="waterIntake"
                        label="Water Intake (L)"
                        type="number"
                        fullWidth
                        value={formData.waterIntake}
                        onChange={handleChange}
                        error={!!errors.waterIntake}
                        helperText={errors.waterIntake}
                    />
                    <TextField
                        name="bloodPressure"
                        label="Blood Pressure"
                        fullWidth
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        error={!!errors.bloodPressure}
                        helperText={errors.bloodPressure}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </DialogActions>
        </Dialog>
    );
}