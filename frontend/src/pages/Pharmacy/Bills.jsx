import React, { useContext, useEffect, useState } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Stack, TextField
} from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import {API_URL, PHARMACY_API_URL} from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext';

const COLORS = ["#4caf50", "#f44336"];

const Bills = () => {
    const { user } = useContext(UserContext);
    const [bills, setBills] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!user?.id) return;

        const fetchBills = async () => {
            try {
                const pharmacyRes = await fetch(`${PHARMACY_API_URL}/pharmacies?userId=${user.id}`, {
                    credentials: "include"
                });
                const pharmacyData = await pharmacyRes.json();
                const pharmacyId = Array.isArray(pharmacyData)
                    ? pharmacyData[0]?.id
                    : pharmacyData?.id;
                if (!pharmacyId) return;

                const billsRes = await fetch(`${PHARMACY_API_URL}/pharmacies/allbills?pharmacyId=${pharmacyId}`, {
                    credentials: "include"
                });

                const billsText = await billsRes.text();
                const billsData = billsText ? JSON.parse(billsText) : [];
                setBills(billsData);
            } catch (err) {
                console.error("Error fetching bills:", err);
            }
        };

        fetchBills();
    }, [user]);

    // Enrich each bill with patient name and drug info
    const enrichBill = (bill) => {
        const pres = bill.prescription;
        const patientUser = pres?.patient?.user;
        const patientFullName = patientUser
            ? `${patientUser.firstName} ${patientUser.lastName}`
            : "Unknown";
        const drugs = [pres?.drug?.name || "N/A"];

        return {
            ...bill,
            patientName: patientFullName,
            drugs
        };
    };

    const filteredBills = bills
        .map(enrichBill)
        .filter(b =>
            !search ||
            b.patientName.toLowerCase().includes(search.toLowerCase())
        );

    const pieData = [
        { name: "Paid", value: filteredBills.filter(b => b.paid).length },
        { name: "Not Paid", value: filteredBills.filter(b => !b.paid).length }
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                💳 Prescription Bills
            </Typography>

            <TextField
                label="Search by Patient Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                {/* Table Section */}
                <Box flex={3}>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#212121" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "#fff" }}><strong>Patient</strong></TableCell>
                                    <TableCell sx={{ color: "#fff" }}><strong>Drugs</strong></TableCell>
                                    <TableCell sx={{ color: "#fff" }}><strong>Amount</strong></TableCell>
                                    <TableCell sx={{ color: "#fff" }}><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBills.length > 0 ? (
                                    filteredBills.map((bill, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{bill.patientName}</TableCell>
                                            <TableCell>{bill.drugs.join(", ")}</TableCell>
                                            <TableCell>${Number(bill.amount).toFixed(2)}</TableCell>
                                            <TableCell sx={{ color: bill.paid ? "lightgreen" : "#f44336", fontWeight: "bold" }}>
                                                {bill.paid ? "Paid" : "Not Paid"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No bills found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Pie Chart Section */}
                <Box flex={2}>
                    <Typography variant="h6" gutterBottom>
                        🧾 Bill Status Overview
                    </Typography>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                    </PieChart>
                </Box>
            </Stack>
        </Container>
    );
};

export default Bills;
