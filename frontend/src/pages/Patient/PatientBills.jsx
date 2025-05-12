// src/pages/Patient/PatientBills.jsx
import React, { useContext, useState } from 'react';
import { Paper, Typography, Divider, CircularProgress, Box, Button, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';
import PatientPaymentPortal from './PaymentPortal.jsx';

export default function PatientBills() {
    const { roleData } = useContext(UserContext);
    const [selectedBill, setSelectedBill] = useState(null);

    const { data: bills = [], isLoading, isError } = useQuery({
        queryKey: ['bills', roleData.id],
        queryFn: () =>
            axios
                .get(`${API_URL}/pharmacies/bills`, {
                    params: { patientId: roleData.id },
                    withCredentials: true
                })
                .then(res => res.data),
        enabled: !!roleData.id
    });

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Failed to load bills</Typography>;

    const outstanding = bills.filter(b => !b.paid);
    const history = bills.filter(b => b.paid);

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Outstanding Bills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {outstanding.length === 0 ? (
                <Typography>No outstanding bills</Typography>
            ) : (
                <Stack spacing={2}>
                    {outstanding.map(bill => (
                        <Box key={bill.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>
                                #{bill.id} — ${bill.amount.toFixed(2)} due {bill.dueDate}
                            </Typography>
                            <Button variant="contained" size="small" onClick={() => setSelectedBill(bill)}>
                                Pay
                            </Button>
                        </Box>
                    ))}
                </Stack>
            )}
            {selectedBill && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <PatientPaymentPortal
                        billId={selectedBill.id}
                        billAmount={selectedBill.amount}
                        prescriptionId={selectedBill.prescription.id}
                        onPaymentSuccess={() => setSelectedBill(null)}
                    />
                </>
            )}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
                Payment History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {history.length === 0 ? (
                <Typography>No payment history</Typography>
            ) : (
                <Stack spacing={2}>
                    {history.map(bill => (
                        <Box key={bill.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography>
                                #{bill.id} — ${bill.amount.toFixed(2)} paid
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            )}
        </Paper>
    );
}