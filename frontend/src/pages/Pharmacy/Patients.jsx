import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from "@mui/material";
import { API_URL, PHARMACY_API_URL } from '../../utils/constants.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import axios from "axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("👤 Current user ID:", user?.id);

        const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
          credentials: 'include'
        });
        const pharmacyData = await pharmacyRes.json();
        console.log("🏥 Pharmacy response:", pharmacyData);

        const pharmacyId = Array.isArray(pharmacyData) ? pharmacyData[0]?.id : pharmacyData?.id;
        if (!pharmacyId) {
          console.warn("⚠️ No pharmacyId found.");
          return;
        }

        const [patRes, presRes] = await Promise.all([
          axios.get(`${API_URL}/patients/by-pharmacy?pharmacyId=${pharmacyId}`, { withCredentials: true }),
          axios.get(`${PHARMACY_API_URL}/pharmacies/rx?pharmacyId=${pharmacyId}`, { withCredentials: true }),
        ]);

        console.log("🧑 Raw patients data:", patRes.data);
        console.log("💊 Raw prescriptions data:", presRes.data);

        const patientArray = Array.isArray(patRes.data) ? patRes.data : [patRes.data];
        const allPrescriptions = presRes.data || [];

        const enriched = patientArray.map(p => {
          const drugsArray = allPrescriptions
            .filter(pr => pr.patient?.id === p.id || pr.patientId === p.id)
            .map(pr => pr.drug?.name || pr.pillName || 'N/A');

          const drugCounts = drugsArray.reduce((acc, name) => {
            acc[name] = (acc[name] || 0) + 1;
            return acc;
          }, {});

          const drugDisplay = Object.entries(drugCounts)
            .map(([name, count]) => `${name} (${count})`)
            .join(', ');

          const enrichedPatient = {
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email ?? p.user?.email ?? '—',
            phone: p.phone ?? p.user?.phone ?? '—',
            address: p.address ?? p.user?.address ?? '—',
            drugs: drugDisplay || '—',
          };

          console.log("✅ Enriched patient:", enrichedPatient);
          return enrichedPatient;
        });

        setPatients(enriched);
        setPrescriptions(allPrescriptions);
      } catch (err) {
        console.error("❌ Error fetching dynamic patient data:", err);
      }
    };

    fetchData();
  }, []);

  const handleContact = (patient) => {
    console.log(`📨 Contacting ${patient.firstName} (${patient.email})`);
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
                  <TableCell>{p.drugs}</TableCell>
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
