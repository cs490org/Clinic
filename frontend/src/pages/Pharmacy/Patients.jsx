import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from "@mui/material";
import axios from "axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, presRes] = await Promise.all([
          axios.get('http://localhost:8080/patients', { withCredentials: true }),
          axios.get('http://localhost:8080/prescriptions', { withCredentials: true }),
        ]);

        const allPatients = patRes.data || [];
        const allPrescriptions = presRes.data || [];

        const enriched = allPatients.map(p => {
          const pills = allPrescriptions
            .filter(pr => pr.patientId === p.id)
            .map(pr => pr.drug?.name || pr.pillName || 'N/A');
          return { ...p, drugs: pills };
        });

        setPatients(enriched);
        setPrescriptions(allPrescriptions);
      } catch (err) {
        console.error("Error fetching patients or prescriptions:", err);
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
