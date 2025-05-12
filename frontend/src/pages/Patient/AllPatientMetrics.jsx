import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import {
    Typography,
    Paper,
    CircularProgress,
    Box,
    Stack,
    Divider,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../utils/queryKeys.js';

export default function AllPatientMetrics({ patientId }) {
    const [appointmentData, setAppointmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get(`${API_URL}/patient/${patientId}/appointment-data`, {
                    withCredentials: true,
                });
                setAppointmentData(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (err) {
                console.error('Error fetching appointment data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]);

    const { data: daily_surveys = [], isLoading: daily_loading } = useQuery({
        queryKey: queryKeys.daily_surveys.all,
        queryFn: async () => {
            return fetch(`${API_URL}/daily_surveys?patientId=${patientId}`, {
                credentials: 'include',
            }).then((res) => res.json());
        },
    });

    const { data: weekly_surveys = [], isLoading: weekly_loading } = useQuery({
        queryKey: queryKeys.weekly_surveys.all,
        queryFn: async () => {
            return fetch(`${API_URL}/weekly_surveys?patientId=${patientId}`, {
                credentials: 'include',
            }).then((res) => res.json());
        },
    });

    if (loading || daily_loading || weekly_loading) return <CircularProgress />;

    const apptLabels = appointmentData.map((d) => `${format(new Date(d.date), 'MMM d')} (#${d.id})`);
    const dailyLabels = daily_surveys.map((d) => format(new Date(d.surveyDate), 'MMM d'));
    const weeklyLabels = weekly_surveys.map((d) =>
        `${dayjs(d.startDate).format('MM/DD')} - ${dayjs(d.startDate).add(6, 'day').format('MM/DD')}`
    );

    const systolic = appointmentData.map((d) => Number(d.bloodPressure?.split('/')?.[0]));
    const diastolic = appointmentData.map((d) => Number(d.bloodPressure?.split('/')?.[1]));
    const waterIntake = appointmentData.map((d) => Number(d.waterIntake));
    const heights = appointmentData.map((d) => Number(d.height));
    const weights = appointmentData.map((d) => Number(d.weight));
    const dailyCalories = daily_surveys.map((d) => d.caloriesEaten);
    const dailyMood = daily_surveys.map((d) => d.mood);
    const weeklyWeight = weekly_surveys.map((d) => d.weight);

    const renderChart = (label, xData, series) => (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                {label}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: '600px' }}>
                    <LineChart xAxis={[{ data: xData, label: 'Date', scaleType: 'point' }]} series={series} />
                </Box>
            </Box>
        </Box>
    );

    return (
        <Paper sx={{ px: [1, 2], py: [2, 3], maxWidth: '100%', overflowX: 'hidden' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                All Patient Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={4}>
                {renderChart('Water Intake', apptLabels, [
                    { data: waterIntake, label: 'Water (mL)', color: '#0288d1' },
                ])}

                {renderChart('Blood Pressure', apptLabels, [
                    { data: systolic, label: 'Systolic (mmHg)', color: '#d32f2f' },
                    { data: diastolic, label: 'Diastolic (mmHg)', color: '#f57c00' },
                ])}

                {renderChart('Height', apptLabels, [
                    { data: heights, label: 'Height (cm)', color: '#388e3c' },
                ])}

                {renderChart('Calories (Daily Survey)', dailyLabels, [
                    { data: dailyCalories, label: 'Calories', color: '#009688' },
                ])}

                {renderChart('Mood (Daily Survey)', dailyLabels, [
                    { data: dailyMood, label: 'Mood (1–10)', color: '#fbc02d' },
                ])}

                {renderChart('Weight (Weekly Survey)', weeklyLabels, [
                    { data: weeklyWeight, label: 'Weight (lbs)', color: '#4caf50' },
                ])}
            </Stack>
        </Paper>
    );
}