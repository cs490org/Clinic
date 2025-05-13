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
    Stack, TextField,
} from '@mui/material';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';

const AllDoctors = ({ onBookClick }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchSpecialty, setSearchSpecialty] = useState('');
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


    const filteredDoctors = doctors.filter((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
        return (
            fullName.includes(searchName.toLowerCase()) &&
            doctor.specialty.toLowerCase().includes(searchSpecialty.toLowerCase())
        );
    });

    const paginatedDoctors = filteredDoctors.slice(
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
            <Typography sx={{ fontWeight: "bold",fontSize:"1.4rem" }} variant="h5" gutterBottom>
                Doctor registry
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    size="small"
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setPage(1);
                    }}
                />
                <TextField
                    label="Search by Specialty"
                    variant="outlined"
                    size="small"
                    value={searchSpecialty}
                    onChange={(e) => {
                        setSearchSpecialty(e.target.value);
                        setPage(1);
                    }}
                />
            </Stack>

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
                            <TableCell>
                                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                    {doctor.user.imgUri && <img width={50} height={50} src={doctor.user.imgUri} alt="Doctor" />}
                                    <b>Dr. {doctor.firstName} {doctor.lastName}</b>
                                </div>
                            </TableCell>
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
                    count={Math.ceil(filteredDoctors.length / doctorsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </TableContainer>
    );
};

export default AllDoctors;
