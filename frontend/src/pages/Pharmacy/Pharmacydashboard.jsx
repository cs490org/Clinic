import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import { Container, Typography, Stack, Box, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // <-- make sure Legend is imported

import axios from 'axios';  

const PharmacyDashboard = () => {
    const { user } = useContext(UserContext);
    const [prescriptionsData, setPrescriptionsData] = useState([]);
    const [newCustomers, setNewCustomers] = useState(0);
    const [profitMargin, setProfitMargin] = useState(0);

   
    useEffect(() => {
        axios.get('http://localhost:8080/api/prescriptions')  
            .then(response => {
                setPrescriptionsData(response.data);  
            })
            .catch(error => {
                console.error('There was an error fetching the prescriptions!', error);
            });
    }, []);


    const data = [
        { name: 'Pill #1', value: 400 },
        { name: 'Pill #2', value: 300 },
        { name: 'Pill #3', value: 200 },
        { name: 'Pill #4', value: 100 },
        { name: 'Pill #5', value: 500 },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Stack spacing={2}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography fontWeight="bold" variant="h4" gutterBottom>
                        Welcome Back, {user.firstName}!
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
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={80}
        fill="#8884d8"
        label
    >
        {data.map((entry, index) => (
            <Cell
                key={`cell-${index}`}
                fill={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'][index]}
            />
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
