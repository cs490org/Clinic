import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Paper, Avatar,
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Divider, Box
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { UserContext } from '../../contexts/UserContext.jsx';
import axios from 'axios';
import { API_URL } from '../../utils/constants.js';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658'];

const PharmacyDashboard = () => {
  const { user } = useContext(UserContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [drugInventory, setDrugInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
          credentials: 'include'
        });
        const pharmacyData = await pharmacyRes.json();
        const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;
        if (!pharmacyId) return;

        const [presRes, patRes, pharmRes] = await Promise.all([
          axios.get(`${API_URL}/pharmacies/rx?pharmacyId=${pharmacyId}`, { withCredentials: true }),
          axios.get(`${API_URL}/patient/pharmacy?pharmacyId=${pharmacyId}`, { withCredentials: true }),
          axios.get(`${API_URL}/pharmacies/drugs?pharmacyId=${pharmacyId}`, { withCredentials: true })
        ]);

        setPrescriptions(presRes.data || []);

        // Normalize and flatten patient data
        const patientArray = Array.isArray(patRes.data) ? patRes.data : [patRes.data];
        const flattenedPatients = patientArray.map(entry => ({
          id: entry.patient.id,
          firstName: entry.patient.firstName,
          lastName: entry.patient.lastName,
          email: entry.patient.email,
          phone: entry.patient.phone,
          address: entry.patient.address,
          imgUri: entry.patient.user?.imgUri
        }));
        setPatients(flattenedPatients);

        setDrugInventory(pharmRes.data || []);

        const grouped = (pharmRes.data || []).reduce((acc, item) => {
          const name = item.drug?.name || 'Unknown';
          acc[name] = (acc[name] || 0) + item.inventory;
          return acc;
        }, {});
        const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
        setDistributionData(chartData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };
    fetchData();
  }, []);

  const monthlyPatients = [
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: patients.length },
  ];

  return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome Back, {user?.firstName?.toUpperCase() || 'Pharmacist'}!
        </Typography>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>📊 Patients This Year</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyPatients}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Patients" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>💊 Prescription Distribution</Typography>
              <PieChart width={250} height={250}>
                <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                >
                  {distributionData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </Paper>
          </Grid>
        </Grid>

        {/* Prescription Table */}
        <Typography variant="h5" gutterBottom>📦 Prescriptions to Fulfill</Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#212121' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}><strong>Customer</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Email</strong></TableCell>
                <TableCell sx={{ color: '#fff' }}><strong>Prescribed Drugs</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.length > 0 ? (
                  patients.map((patient, i) => {
                    const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
                    const pills = patientPrescriptions.map(p => p.drug?.name || p.pillName || 'N/A').join(', ');
                    return (
                        <TableRow key={i}>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {patient.firstName} {patient.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">📧 {patient.email}</Typography>
                          </TableCell>
                          <TableCell>
                            {pills || '—'}
                          </TableCell>
                        </TableRow>
                    );
                  })
              ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No patients to display</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* Drug Inventory */}
        <Typography variant="h5" gutterBottom>💊 Drug Inventory</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {drugInventory.map((pill, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <img
                      src={pill.drug?.image}
                      alt={pill.drug?.name}
                      style={{ width: '100%', height: 120, objectFit: 'contain' }}
                  />
                  <Typography variant="h6">{pill.drug?.name}</Typography>
                  <Typography variant="body2">{pill.drug?.description}</Typography>
                  <Typography variant="body2"><strong>Dosage:</strong> {pill.drug?.dosage}</Typography>
                  <Typography variant="body2"><strong>Price:</strong> ${pill.drug?.price}</Typography>
                  <Typography variant="body2"><strong>Quantity:</strong> {pill.inventory}</Typography>
                </Paper>
              </Grid>
          ))}
        </Grid>

        {/* Registered Patients */}
        <Typography variant="h5" gutterBottom>🧑‍⚕️ Registered Patients</Typography>
        <Grid container spacing={3}>
          {patients.map((p, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={3}>
                  <Avatar src={p.imgUri} sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                    {p.firstName[0]}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold">{p.firstName} {p.lastName}</Typography>
                    <Typography variant="body2">📧 {p.email}</Typography>
                    <Typography variant="body2">📞 {p.phone}</Typography>
                    <Typography variant="body2">📍 {p.address}</Typography>
                  </Box>
                </Paper>
              </Grid>
          ))}
        </Grid>
      </Container>
  );
};

export default PharmacyDashboard;
