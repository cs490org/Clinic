import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {Box, Card, CardContent, CardMedia, Typography, Grid, Divider, Button,} from '@mui/material';
//Will be of tables patient, meal_plan, appointment, daily_survey, weekly_survey, and prescription
import NavBar from "../../NavBar"

function ViewPatientHealth(){
    const {user_id} = useParams();
    const [patient, setPatient] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [dailySurveys, setDailySurveys] = useState([]);
    const [weeklySurveys, setWeeklySurveys] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        Promise.all([
            axios.get(`/api/patient/${user_id}`),
            axios.get(`/api/meal_plan?patientId=${user_id}`),
            axios.get(`/api/prescription?patientId=${user_id}`),
            axios.get(`/api/appointment?patientId=${user_id}`),
            axios.get(`/api/daily_survey?patientId=${user_id}`),
            axios.get(`/api/weekly_survey?patientId=${user_id}`),
        ]).then(([patientRes, mealPlanRes, prescriptionRes, apptRes, dailyRes, weeklyRes]) =>{
            setPatient(patientRes.data);
            setMealPlan(mealPlanRes.data);
            setPrescription(prescriptionRes.data);
            setAppointments(apptRes.data);
            setDailySurveys(dailyRes.data);
            setWeeklySurveys(weeklyRes.data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching patient data: ', error);
            setLoading(false);
        });
    }, [user_id]);

    if(loading){
        return <Typography>Loading Patient Data</Typography>;
    }
    if (!patient){
        return <Typography>Patient Not Found</Typography> 
        //This should not happen as we would only be able to access
        //Existing patients not pending patients
    }
    const {
        first_name,
        last_name,
        email,
        phone,
    } = patient;

    return (
        <Box sx = {{p:3}}>
            <Typography variant = "h4" gutterBottom>
                View Patient Health
            </Typography>

            <Grid container spacing = {2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardMedia component = "img" height = "200" image = "placeholder.png" alt = {`${first_name} ${last_name}`} />
                        <CardContent>
                            <Typography variant="h5">
                                {first_name} {last_name}
                            </Typography>
                            <Typography>Email: {email}</Typography>
                            <Typography>Phone: {phone}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{mb:2}}>
                        <CardContent>
                            <Typography variant="h6">Meal Plan</Typography>
                            <Divider sx={{my:1}} />
                            {mealPlan ? (
                                <Box>
                                    <Typography>Breakfast ID: {mealPlan.breakfast_id}</Typography>
                                    <Typography>Lunch ID: {mealPlan.lunch_id}</Typography>
                                    <Typography>Dinner ID: {mealPlan.dinner_id}</Typography>
                                    <Button variant="contained" sx ={{mt:1}}> Assign Meal Plan</Button>
                                </Box>
                            ) : (
                                <Typography>No Meal Plan Found</Typography>
                            )}
                        </CardContent>
                    </Card>
                    <Card sx = {{mb : 2}}>
                        <CardContent>
                            <Typography variant = "h6">Upcoming Appointment</Typography>
                            <Divider sx={{my:1}} />
                            {appointments.length > 0 ? (
                                <Box>
                                    <Typography>Time: {appointments[0].appointments_timestamp}</Typography>
                                    <Typography>Status: {appointments[0].appointments_status_code}</Typography>
                                    <Button variant="contained" sx ={{mt:1}}> Reschedule</Button>
                                </Box>
                            ) : (
                                <Typography>No Upcoming Appointments</Typography>
                            )}
                        </CardContent>
                    </Card>
                    <Card sx={{mb:2}}>
                        <CardContent>
                            <Typography variant="h6">Medication</Typography>
                            <Divider sx={{my:1}} />
                            {prescription.length>0 ? (
                                prescription.map((rx) => (
                                    <Box key={rx.user_id} sx={{mb:2}}>
                                        <Typography>Prescription ID: {rx.user_id}</Typography>
                                        <Typography>Status: {rx.rx_status_code}</Typography>
                                        <Typography> Expiry: {rx.rx_expiry_timestamp}</Typography>
                                        <Button variant="contained" sx ={{mt:1}}> Assign Medication</Button>
                                        <Divider sx={{my:1}} />
                                    </Box>
                                ))
                            ) : (
                                <Typography>No Active Prescriptions</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing = {2} sx={{mt:2}}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Daily Surveys</Typography>
                            <Divider sx={{my:1}} />
                            {dailySurveys.length > 0 ? (
                                dailySurveys.map((survey) => (
                                    <Box key={survey.id} sx={{mb:1}}>
                                        <Typography>{new Date(survey.create_timestamp).toLocaleDateString()} - Mood: {survey.mood}. Calories: {survey.calories_eaten}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No Daily Survey Data</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6"> Weekly Surveys</Typography>
                            <Divider sx={{my:1}} />
                            {weeklySurveys.length > 0 ? (
                                weeklySurveys.map((survey) => (
                                    <Box key={survey.id} sx={{mb:1}} >
                                        <Typography>
                                            {new Date(survey.create_timestamp).toLocaleDateString()} - Weight: {survey.weight}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No Weekly Survey Data</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewPatientHealth;
/*
Reschedule button can be removed as we didn't have them in our figma
For our weekly and daily survey's we need to add the images. As of now they just display values
Need to add the backend components
*/