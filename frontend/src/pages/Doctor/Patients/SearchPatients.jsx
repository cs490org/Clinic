import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../utils/constants";
import {Link} from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    TablePagination
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchPatients() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("name");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await axios.get(`${API_URL}/patients`, { withCredentials: true });
            setPatients(res.data);
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient => {
        if (!searchTerm) return true;

        const searchTermLower = searchTerm.toLowerCase();

        switch (searchField) {
            case "name":
                const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
                return fullName.includes(searchTermLower);
            case "email":
                return patient.email.toLowerCase().includes(searchTermLower);
            case "address":
                return patient.address.toLowerCase().includes(searchTermLower);
            case "phone":
                return patient.phone.toLowerCase().includes(searchTermLower);
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
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography fontSize={"2rem"} fontWeight={"bold"}>Patient Registry</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                    <FormControl sx={{ flex: 1, width: "100%" }}>
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
                        size="small"
                        placeholder={`Search by ${searchField}...`}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reset to first page when searching
                        }}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                        sx={{ flex: 4, width: "100%" }}
                    />
                </Stack>
                <Box>
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
                                                <TableCell>
                                                    <Link to={`/patients/${patient.id}`}> 
                                                        {patient.firstName} {patient.lastName}
                                                    </Link>
                                                </TableCell>
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
                </Box>
            </Stack>
        </Paper>
    );
}