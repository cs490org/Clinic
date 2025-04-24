import React, { useState } from "react";
import {
    Box, Container, Typography, TextField, Select, MenuItem, IconButton,
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Stack
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';
import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
    { fullName: "name", email: "name@email.com", phone: "####", paid: true },
    { fullName: "name", email: "name@email.com", phone: "####", paid: false },
    { fullName: "name", email: "name@email.com", phone: "####", paid: true },
    { fullName: "name", email: "name@email.com", phone: "####", paid: false },
    { fullName: "name", email: "name@email.com", phone: "####", paid: true }
];

const pieData = [
    { name: "Paid", value: data.filter(d => d.paid).length },
    { name: "Not Paid", value: data.filter(d => !d.paid).length }
];

const COLORS = ["#4caf50", "#f44336"];

const Bills = () => {
    const [search, setSearch] = useState("");
    const [filterAttr, setFilterAttr] = useState("Name");

    const filteredData = data.filter(entry =>
        entry.email.toLowerCase().includes(search.toLowerCase()) ||
        entry.fullName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom> Bills </Typography>

            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TextField
                    label="Search"
                    variant="outlined"
                    placeholder="Name, email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                    value={filterAttr}
                    onChange={(e) => setFilterAttr(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="Name">Name</MenuItem>
                    <MenuItem value="Email">Email</MenuItem>
                </Select>
                <IconButton><FilterListIcon /></IconButton>
                <Button variant="outlined">ACTION</Button>
                <Button variant="contained">ACTION</Button>
                <IconButton><SettingsIcon /></IconButton>
            </Stack>

            <Stack direction="row" spacing={4}>
                <Box flex={3}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone number</TableCell>
                                    <TableCell>Paid</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.fullName}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell>{row.paid ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box flex={2}>
                    <Typography variant="h5" sx={{ mb: 2 }}>OVERVIEW BILLS:</Typography>
                    <PieChart width={250} height={250}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </Box>
            </Stack>
        </Container>
    );
};

export default Bills;
