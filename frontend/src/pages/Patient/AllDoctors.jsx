import { useState, useEffect } from 'react';
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
    Button,
    Pagination,
    Stack,
} from '@mui/material';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';

const AllDoctors = ({ onBookClick }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const doctorsPerPage = 2;

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/doctors`, {
                    withCredentials: true
                });
                setDoctors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const paginatedDoctors = doctors.slice(
        (page - 1) * doctorsPerPage,
        page * doctorsPerPage
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ p: "1rem" }}>
            <Typography sx={{ fontWeight: "bold" }} variant="h5" gutterBottom>
                Doctor registry
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Specialty</strong></TableCell>
                        <TableCell><strong>Book Appointment</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedDoctors.map((doctor, index) => (
                        <TableRow key={index}>
                            <TableCell>Dr. {doctor.firstName} {doctor.lastName}</TableCell>
                            <TableCell>{doctor.specialty}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onBookClick(doctor)}
                                    disabled={!doctor.acceptingNewPatients}
                                    sx={{
                                        opacity: doctor.acceptingNewPatients ? 1 : 0.5,
                                        '&:hover': {
                                            opacity: doctor.acceptingNewPatients ? 0.9 : 0.5
                                        }
                                    }}
                                >
                                    {doctor.acceptingNewPatients ? 'Book Appointment' : 'Not Accepting Patients'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <Pagination
                    count={Math.ceil(doctors.length / doctorsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </TableContainer>
    );
};

export default AllDoctors;
