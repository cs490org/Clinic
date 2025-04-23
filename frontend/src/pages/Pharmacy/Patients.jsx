import React, { useState } from "react";
import {
  Box, Container, Typography, TextField, Select, MenuItem, IconButton,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Stack
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';

const dummyPatients = [
  { fullName: "name", email: "name@email.com", phone: "####", paid: true },
  { fullName: "name", email: "name@email.com", phone: "####", paid: false },
  { fullName: "name", email: "name@email.com", phone: "####", paid: true },
  { fullName: "name", email: "name@email.com", phone: "####", paid: false },
  { fullName: "name", email: "name@email.com", phone: "####", paid: true },
];

export default function Patients() {
  const [search, setSearch] = useState("");
  const [filterAttr, setFilterAttr] = useState("Name");

  const filteredPatients = dummyPatients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Patients
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Name, email, etc..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterAttr}
          onChange={(e) => setFilterAttr(e.target.value)}
        >
          <MenuItem value="Name">Name</MenuItem>
          <MenuItem value="Email">Email</MenuItem>
        </Select>
        <IconButton><FilterListIcon /></IconButton>
        <Button variant="outlined">ACTION</Button>
        <Button variant="contained">ACTION</Button>
        <IconButton><SettingsIcon /></IconButton>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.paid ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="body2">Rows per page: 10</Typography>
        <Typography variant="body2" color="primary">1–5 of 13</Typography>
      </Box>
    </Container>
  );
}
