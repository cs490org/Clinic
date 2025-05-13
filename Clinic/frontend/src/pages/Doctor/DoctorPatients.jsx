import { useState, useEffect, useContext } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
    Typography, Button, Modal,
} from '@mui/material';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../../contexts/UserContext';
import PatientSymptoms from "../Patient/PatientSymptoms.jsx";
import AllPatientMetrics from "../Patient/AllPatientMetrics.jsx";

const DoctorPatients = () => {

    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const handleOpen = (patient) => {
        setSelectedPatient(patient);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedPatient(null);
    };


    const { roleData } = useContext(UserContext)
    const { data: patients, isLoading, error } = useQuery({
        queryKey: ['doctor_patients'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/doctor/patients?doctorId=${roleData.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch patients');
            return res.json();
        }
    });
    const [graphOpen, setGraphOpen] = useState(false);
    const [graphPatient, setGraphPatient] = useState(null);

    const handleGraphOpen = (patient) => {
        setGraphPatient(patient);
        setGraphOpen(true);
    };
    const handleGraphClose = () => {
        setGraphOpen(false);
        setGraphPatient(null);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">{error.message}</Typography>
            </Paper>
        );
    }


    return (
        <>
        <TableContainer component={Paper} sx={{ p: "1rem", height: '100%' }}>
            <Typography sx={{ fontWeight: "bold" }} variant="h5" gutterBottom>
                My Patients
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Phone</strong></TableCell>
                        <TableCell><strong>View Symptoms</strong></TableCell>
                        <TableCell><strong>View Graphs</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients?.map((patient, index) => (
                        <TableRow key={index}>
                            <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell>{patient.phone}</TableCell>
                            <TableCell><Button onClick={()=>{handleOpen(patient)}} variant={"contained"}>View symptoms</Button></TableCell>
                            <TableCell>
                                <Button onClick={() => handleGraphOpen(patient)} variant="contained">
                                    View Graphs
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {(!patients || patients.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                No patients found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>

            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        width: '90vw',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        borderRadius: 1,
                    }}
                >
                    <PatientSymptoms patient_id={selectedPatient?.id} view_only={true}/>
                </Box>
            </Modal>
            <Modal
                open={graphOpen}
                onClose={handleGraphClose}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        width: '90vw',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {graphPatient?.firstName} {graphPatient?.lastName}'s Health Graphs
                    </Typography>
                    <AllPatientMetrics patientId={graphPatient?.id} />
                </Box>
            </Modal>
            </>
    );
};

export default DoctorPatients; 