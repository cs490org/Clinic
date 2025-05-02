import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import {
    Container, Typography, Stack, Box, Grid, Paper
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const PharmacyDashboard = () => {
    const { user } = useContext(UserContext);
    const [prescriptionsData, setPrescriptionsData] = useState([]);
    const [newCustomers, setNewCustomers] = useState(0); // Replace with real data if available
    const [profitMargin, setProfitMargin] = useState(0); // Replace with real data if available
    const [distributionData, setDistributionData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/prescriptions', {
            withCredentials: true // ✅ this sends session cookie
        })
        .then(response => {
            const prescriptions = response.data || [];
            setPrescriptionsData(prescriptions);
    
            // Optional: group data for pie chart
            const grouped = prescriptions.reduce((acc, item) => {
                acc[item.pillName] = (acc[item.pillName] || 0) + 1;
                return acc;
            }, {});
            const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
            setDistributionData(chartData);
        })
        .catch(error => {
            console.error('There was an error fetching the prescriptions!', error);
        });
    }, []);
    

    return (
        <Container sx={{ mt: 4 }}>
            <Stack spacing={2}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography fontWeight="bold" variant="h4" gutterBottom>
                        Welcome Back, {user?.firstName || "Pharmacist"}!
                    </Typography>
                </Box>

                {/* Overview Section */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6">This Month Overview:</Typography>
                            <Typography variant="body1">New Customers: {newCustomers}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                                <Typography variant="h5" color="green">
                                    Profit Margin: {profitMargin}%
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Pie Chart */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Prescription Distribution</Typography>
                            <PieChart width={250} height={250}>
                                <Pie
                                    data={distributionData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80}
                                    label
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                            </PieChart>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Prescription List */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Prescriptions to Fulfill</Typography>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Pill Name</th>
                                <th>Customer's Name</th>
                                <th>Customer's Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptionsData.length > 0 ? (
                                prescriptionsData.map((prescription, index) => (
                                    <tr key={index}>
                                        <td>{prescription.pillName}</td>
                                        <td>{prescription.customerName}</td>
                                        <td>{prescription.customerEmail}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center' }}>No prescriptions to fulfill</td>
                                </tr>
                            )}
                        </tbody>
                    </Box>
                </Box>
            </Stack>
        </Container>
    );
};

export default PharmacyDashboard;
