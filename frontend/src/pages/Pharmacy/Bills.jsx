import React, { useContext, useEffect, useState } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, Stack
} from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext';

const COLORS = ["#4caf50", "#f44336"];

const Bills = () => {
    const { user } = useContext(UserContext);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchBills = async () => {
            try {
                // Step 1: Get pharmacy by userId
                const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
                    credentials: "include"
                });

                const pharmacyData = await pharmacyRes.json();
                const pharmacyId = Array.isArray(pharmacyData)
                    ? pharmacyData[0]?.id
                    : pharmacyData?.id;

                if (!pharmacyId) {
                    console.warn("Pharmacy ID not found");
                    return;
                }

                // Step 2: Get bills for pharmacy
                const billsRes = await fetch(`${API_URL}/pharmacies/bills?pharmacyId=${pharmacyId}`, {
                    credentials: "include"
                });

                const text = await billsRes.text();
                if (!text) {
                    console.warn("Empty response from /bills");
                    setBills([]);
                    return;
                }

                const billsData = JSON.parse(text);
                setBills(billsData);
            } catch (err) {
                console.error("Error fetching bills:", err);
            }
        };

        fetchBills();
    }, [user]);

    const pieData = [
        { name: "Paid", value: bills.filter(b => b.paid).length },
        { name: "Not Paid", value: bills.filter(b => !b.paid).length }
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h3" gutterBottom> Prescription Bills </Typography>

            <Stack direction="row" spacing={4}>
                <Box flex={3}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Prescription ID</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bills.map((bill, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{bill.prescriptionId}</TableCell>
                                        <TableCell>${Number(bill.amount).toFixed(2)}</TableCell>
                                        <TableCell style={{ color: bill.paid ? "green" : "red", fontWeight: "bold" }}>
                                            {bill.paid ? "Paid" : "Not Paid"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box flex={2}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Bill Status Overview</Typography>
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
