import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, TextField
} from "@mui/material";
import { API_URL, PHARMACY_API_URL } from '../../utils/constants.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import axios from "axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pharmacyRes = await fetch(`${PHARMACY_API_URL}/pharmacies?userId=${user.id}`, {
          credentials: 'include'
        });
        const pharmacyData = await pharmacyRes.json();
        const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;
        if (!pharmacyId) {
          console.warn("❌ No pharmacy ID found.");
          return;
        }

        const [patRes, presRes] = await Promise.all([
          axios.get(`${API_URL}/patient/pharmacy?pharmacyId=${pharmacyId}`, { withCredentials: true }),
          axios.get(`${PHARMACY_API_URL}/pharmacies/rx?pharmacyId=${pharmacyId}`, { withCredentials: true }),
        ]);

        const patientArray = Array.isArray(patRes.data) ? patRes.data : [patRes.data];
        const allPrescriptions = presRes.data || [];

        const enriched = patientArray.map(p => {
          const drugMap = {};

          allPrescriptions
            .filter(pr =>
              pr.patient?.id === p.id ||
              pr.patientId === p.id ||
              pr.patient?.user?.email === p.email ||
              pr.patient?.email === p.email
            )
            .forEach(pr => {
              const name = pr.drug?.name || pr.pillName || 'N/A';
              drugMap[name] = (drugMap[name] || 0) + 1;
            });

          const drugs = Object.entries(drugMap).map(([name, count]) =>
            count > 1 ? `${name} (${count})` : name
          );

          return {
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            phone: p.phone || '—',
            address: p.address || '—',
            drugs
          };
        });

        setPatients(enriched);
        setPrescriptions(allPrescriptions);
      } catch (err) {
        console.error("❌ Error fetching patient data:", err);
      }
    };

    fetchData();
  }, [user.id]);

  const handleContact = (patient) => {
    console.log(`📨 Contacting ${patient.firstName} (${patient.email})`);
  };

  // Filter patients by name or email
  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Patients at Your Pharmacy
      </Typography>

      <TextField
        label="Search Patients by Name or Email"
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#212121' }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}><strong>Name</strong></TableCell>
                <TableCell sx={{ color: "#fff" }}><strong>Email</strong></TableCell>
                <TableCell sx={{ color: "#fff" }}><strong>Address</strong></TableCell>
                <TableCell sx={{ color: "#fff" }}><strong>Phone</strong></TableCell>
                <TableCell sx={{ color: "#fff" }}><strong>Drugs</strong></TableCell>
                <TableCell sx={{ color: "#fff" }}><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? filteredPatients.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.firstName} {p.lastName}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.drugs?.join(', ') || '—'}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleContact(p)}>
                      💬 Talk
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No patients found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
