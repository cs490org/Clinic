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
    Typography,
} from '@mui/material';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../../contexts/UserContext';

const DoctorPatients = () => {
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients?.map((patient, index) => (
                        <TableRow key={index}>
                            <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell>{patient.phone}</TableCell>
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
    );
};

export default DoctorPatients; 