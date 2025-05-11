import React, { useContext, useEffect, useState } from 'react';
import { API_URL } from '../../utils/constants.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from "@mui/material";
import axios from "axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pharmacy by user ID
        const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
          credentials: 'include'
        });
        const pharmacyData = await pharmacyRes.json();
        const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;
        if (!pharmacyId) return;
  
        // Fetch patients and prescriptions filtered by pharmacy
        const [patRes, presRes] = await Promise.all([
          axios.get(`${API_URL}/patient/pharmacy?pharmacyId=${pharmacyId}`, { withCredentials: true }),
          axios.get(`${API_URL}/pharmacies/rx?pharmacyId=${pharmacyId}`, { withCredentials: true }),
        ]);
  
        const patientArray = Array.isArray(patRes.data) ? patRes.data : [patRes.data];
        const allPrescriptions = presRes.data || [];
  
        const enriched = patientArray.map(entry => {
          const p = entry.patient;
          const pills = allPrescriptions
            .filter(pr => pr.patientId === p.id)
            .map(pr => pr.drug?.name || pr.pillName || 'N/A');
          return { ...p, drugs: pills };
        });
  
        setPatients(enriched);
        setPrescriptions(allPrescriptions);
      } catch (err) {
        console.error("Error fetching dynamic patient data:", err);
      }
    };
    fetchData();
  }, []);

  const handleContact = (patient) => {
    console.log(`📨 Send message to: ${patient.firstName} ${patient.lastName} (${patient.email})`);
    // Here, integrate with RabbitMQ or backend endpoint
    // Example: axios.post('/api/contact', { patientId: patient.id, message: "..." })
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Patients at Your Pharmacy
      </Typography>

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
              {patients.length > 0 ? patients.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.firstName} {p.lastName}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.drugs.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleContact(p)}
                    >
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
