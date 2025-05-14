import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Divider,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';
import { UserContext } from '../../contexts/UserContext.jsx';
import { API_URL, PHARMACY_API_URL } from '../../utils/constants.js';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658'];

export default function PharmacyDashboard() {
  const { user } = useContext(UserContext);
  const [prescriptions, setPrescriptions]       = useState([]);
  const [patients, setPatients]                 = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [drugInventory, setDrugInventory]       = useState([]);
  const [loading, setLoading]                   = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1) Get pharmacy ID
      const pharmRes = await axios.get(
          `${PHARMACY_API_URL}/pharmacies`,
          { params: { userId: user.id }, withCredentials: true }
      );
      const pharm = Array.isArray(pharmRes.data) ? pharmRes.data[0] : pharmRes.data;
      const pharmacyId = pharm?.id;
      if (!pharmacyId) return;

      // 2) Parallel fetch: prescriptions, patient links, inventory, and bills
      const [presRes, patRes, invRes, billRes] = await Promise.all([
        axios.get(
            `${PHARMACY_API_URL}/pharmacies/rx`,
            { params: { pharmacyId }, withCredentials: true }
        ),
        axios.get(
            `${API_URL}/patient/pharmacy`,
            { params: { pharmacyId }, withCredentials: true }
        ),
        axios.get(
            `${PHARMACY_API_URL}/pharmacies/drugs`,
            { params: { pharmacyId }, withCredentials: true }
        ),
        axios.get(
            `${PHARMACY_API_URL}/pharmacies/allbills`,
            { params: { pharmacyId }, withCredentials: true }
        )
      ]);

      // Build lookup of which prescriptions have a paid bill
      const paidMap = new Map(
          (billRes.data || []).map(b => [b.prescription.id, b.paid])
      );

      // Build a local stock map to avoid stale reads
      const stockMap = new Map(
          (invRes.data || []).map(item => [item.drug.id, item.inventory])
      );

      // 3) Auto-process only ONE NEW_PRESCRIPTION if its bill is paid and stock ≥1
      for (let rx of presRes.data || []) {
        if (
            rx.rxStatusCode === 'NEW_PRESCRIPTION' &&
            paidMap.get(rx.id) === true
        ) {
          const currentQty = stockMap.get(rx.drug.id) ?? 0;
          if (currentQty > 0) {
            // decrement inventory on server
            await axios.patch(
                `${PHARMACY_API_URL}/pharmacies/drugs/inventory`,
                {
                  pharmacyId,
                  drugId: rx.drug.id,
                  quantity: currentQty - 1,
                  dispensed: false
                },
                { withCredentials: true }
            );
            stockMap.set(rx.drug.id, currentQty - 1);

            // mark prescription ready
            await axios.patch(
                `${PHARMACY_API_URL}/${rx.id}/status`,
                null,
                { params: { status: 'READY_FOR_PICKUP' }, withCredentials: true }
            );

            // only process one at a time
            break;
          }
        }
      }

      // 4) Re-fetch prescriptions & inventory
      const [newPresRes, newInvRes] = await Promise.all([
        axios.get(
            `${PHARMACY_API_URL}/pharmacies/rx`,
            { params: { pharmacyId }, withCredentials: true }
        ),
        axios.get(
            `${PHARMACY_API_URL}/pharmacies/drugs`,
            { params: { pharmacyId }, withCredentials: true }
        )
      ]);

      // 5) Update state
      setPrescriptions(newPresRes.data || []);
      const patArr = Array.isArray(patRes.data) ? patRes.data : [patRes.data];
      setPatients(
          patArr.map(p => ({
            id: p.userId,
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            phone: p.phone,
            address: p.address,
            imgUri: p.imgUri
          }))
      );
      setDrugInventory(newInvRes.data || []);
      const grouped = (newInvRes.data || []).reduce((acc, item) => {
        const name = item.drug?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + item.inventory;
        return acc;
      }, {});
      setDistributionData(
          Object.entries(grouped).map(([name, value]) => ({ name, value }))
      );
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user.id, fetchData]);

  const handleFulfill = async rx => {
    try {
      // get pharmacyId
      const pharmRes = await axios.get(
          `${PHARMACY_API_URL}/pharmacies`,
          { params: { userId: user.id }, withCredentials: true }
      );
      const pharm = Array.isArray(pharmRes.data) ? pharmRes.data[0] : pharmRes.data;
      const pharmacyId = pharm?.id;
      if (!pharmacyId) throw new Error('No pharmacy ID');

      // log dispense
      await axios.post(
          `${API_URL}/dispenselog/log`,
          { pharmacyId, drugId: rx.drug.id, quantity: 1 },
          { withCredentials: true }
      );

      // update status to FULFILLED
      await axios.patch(
          `${API_URL}/prescriptions/${rx.id}/status`,
          null,
          { params: { status: 'FULFILLED' }, withCredentials: true }
      );

      toast.success('Prescription fulfilled');
      fetchData();
    } catch (err) {
      console.error('Fulfill failed:', err);
      toast.error('Could not fulfill prescription');
    }
  };

  if (loading) {
    return (
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
    );
  }

  const monthlyPatients = [
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: patients.length }
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
              <Typography variant="h6" gutterBottom>
                📊 Patients This Year
              </Typography>
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
              <Typography variant="h6" gutterBottom>
                💊 Prescription Distribution
              </Typography>
              <PieChart width={250} height={250}>
                <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                >
                  {distributionData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </Paper>
          </Grid>
        </Grid>

        {/* Prescriptions to Fulfill */}
        <Typography variant="h5" gutterBottom>
          📦 Prescriptions to Fulfill
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#d71600' }}>
              <TableRow>
                <TableCell><strong>Patient</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Prescription</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions
                  .filter(rx => rx.rxStatusCode !== 'FULFILLED')
                  .reverse()
                  .map((rx, idx) => {
                    const patient = rx.patient?.user;
                    if (!patient) return null;
                    const drugName = rx.drug?.name || 'Unnamed';
                    const dosage   = rx.dosage || rx.drug?.dosage || 'N/A';
                    const ready    = rx.rxStatusCode === 'READY_FOR_PICKUP';

                    return (
                        <TableRow key={idx}>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {patient.firstName} {patient.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              💊 {drugName} — {dosage}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={!ready}
                                onClick={() => handleFulfill(rx)}
                            >
                              Fulfill Order
                            </Button>
                          </TableCell>
                        </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* Drug Inventory */}
        <Typography variant="h5" gutterBottom>
          💊 Drug Inventory
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {drugInventory.map((pill, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <img
                      src={pill.drug?.image}
                      alt={pill.drug?.name}
                      style={{ width: '100%', height: 120, objectFit: 'contain' }}
                  />
                  <Typography variant="h6">
                    {pill.drug?.name}
                  </Typography>
                  <Typography variant="body2">
                    {pill.drug?.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dosage:</strong> {pill.drug?.dosage}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price:</strong> ${pill.drug?.price}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {pill.inventory}
                  </Typography>
                </Paper>
              </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Registered Patients */}
        <Typography variant="h5" gutterBottom>
          🧑‍⚕️ Registered Patients
        </Typography>
        <Grid container spacing={3}>
          {patients.map((p, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper
                    sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
                    elevation={3}
                >
                  <Avatar
                      src={p.imgUri}
                      sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                  >
                    {p.firstName[0]}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold">
                      {p.firstName} {p.lastName}
                    </Typography>
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
}