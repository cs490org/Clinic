import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Typography, FormControl, InputLabel, Select, MenuItem, Button} from '@mui/material';

function AssignMealPlanPage(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [mealPlans, setMealPlans] = useState([]);
    const[selectedMealPlan, setSelectedMealPlan] = useState('');

    useEffect (() => {
        axios.get('/api/meal-plans').then((response) => {
            setMealPlans(response.data);
        }).catch((error) => {
            console.error('Error fetching meal plans: ', error);
        });
    }, []);

    const handleAssign = () => {
        axios.post('/api/assign-meal-plan', {
            patientId: id,
            mealPlanId: selectedMealPlan
        }).then(() => {navigate(`/view-patient-health/${id}`);}).catch((error) =>{
            console.error('Error assigning meal plan: ', error);
        });
    };

    return (
        <Box sx={{p:4}}>
            <Typography variant='h4' gutterBottom>
                Assign Meal Plan
            </Typography>
            <FormControl fullWidth sx={{mb:2}}>
                <InputLabel id="meal-plan-label">Meal Plan</InputLabel>
                <Select labelId="meal-plan-label" value = {selectedMealPlan} label = "Meal Plan"
                onChange={(e) => setSelectedMealPlan(e.target.value)}>
                    {mealPlans.map((plan) => (
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

export default AssignMealPlanPage