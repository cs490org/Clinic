import React, { useContext, useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    TablePagination,
    Box
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import { API_URL } from "../../utils/constants";
import { UserContext } from "../../contexts/UserContext";

export default function PharmacyPatients() {
    const { user } = useContext(UserContext);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("name");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        if (!user?.id) return;

        const fetchPatientsForPharmacy = async () => {
            try {
                const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
                    credentials: "include"
                });

                const pharmacyData = await pharmacyRes.json();
                const pharmacyId = Array.isArray(pharmacyData)
                    ? pharmacyData[0]?.id
                    : pharmacyData?.id;

                if (!pharmacyId) {
                    console.warn("No pharmacy found.");
                    return;
                }

                const patientsRes = await fetch(`${API_URL}/pharmacies/patients?pharmacyId=${pharmacyId}`, {
                    credentials: "include"
                });

                if (patientsRes.ok) {
                    const patientsData = await patientsRes.json();
                    setPatients(patientsData);
                }
            } catch (error) {
                console.error("Error fetching pharmacy patients:", error);
            }
        };

        fetchPatientsForPharmacy();
    }, [user]);

    const filteredPatients = patients.filter((patient) => {
        if (!searchTerm) return true;
        const searchTermLower = searchTerm.toLowerCase();
        switch (searchField) {
            case "name":
                return `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTermLower);
            case "email":
                return patient.email?.toLowerCase().includes(searchTermLower);
            case "address":
                return patient.address?.toLowerCase().includes(searchTermLower);
            case "phone":
                return patient.phone?.toLowerCase().includes(searchTermLower);
            default:
                return true;
        }
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Patients at Your Pharmacy
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
                <FormControl fullWidth>
                    <InputLabel>Search by</InputLabel>
                    <Select
                        value={searchField}
                        label="Search by"
                        onChange={(e) => setSearchField(e.target.value)}
                        sx={{ height: 40 }}
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="address">Address</MenuItem>
                        <MenuItem value="phone">Phone</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    placeholder={`Search by ${searchField}...`}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    }}
                />
            </Stack>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Phone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPatients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        {searchTerm
                                            ? `No patients found matching your search by ${searchField}.`
                                            : "No patients found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPatients
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                                            <TableCell>{patient.email}</TableCell>
                                            <TableCell>{patient.address}</TableCell>
                                            <TableCell>{patient.phone}</TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {filteredPatients.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredPatients.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                )}
            </Paper>
        </Container>
    );
}
