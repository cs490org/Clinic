import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Typography, FormControl, InputLabel, Select, MenuItem, Button} from '@mui/material';

function AssignMedicationPage(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [medication, setMedications] = useState([]);
    const[selectedMedication, setSelectedMedication] = useState('');

    useEffect (() => {
        axios.get('/api/medication').then((response) => {
            setMedications(response.data);
        }).catch((error) => {
            console.error('Error fetching medication: ', error);
        });
    }, []);

    const handleAssign = () => {
        axios.post('/api/assign-medication', {
            patientId: id,
            mealPlanId: selectedMedication
        }).then(() => {navigate(`/view-patient-health/${id}`);}).catch((error) =>{
            console.error('Error assigning medication: ', error);
        });
    };

    return (
        <Box sx={{p:4}}>
            <Typography variant='h4' gutterBottom>
                Assign Medication
            </Typography>
            <FormControl fullWidth sx={{mb:2}}>
                <InputLabel id="medication-label">Medication</InputLabel>
                <Select labelId="medication-label" value = {selectedMedication} label = "Medication"
                onChange={(e) => setSelectedMedication(e.target.value)}>
                    {medication.map((plan) => (
                        <MenuItem key={plan.id} value = {plan.id}>
                            {plan.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant = "contained" onClick={handleAssign}>
                Assign
            </Button>
        </Box>
    );
}

export default AssignMedicationPage