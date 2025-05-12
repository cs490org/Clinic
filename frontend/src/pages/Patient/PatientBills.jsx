// src/pages/Patient/PatientBills.jsx

import React, { useContext, useState } from 'react';
import {
    Paper,
    Typography,
    Divider,
    CircularProgress,
    Box,
    Button,
    Stack,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';
import PatientPaymentPortal from './PaymentPortal.jsx';

export default function PatientBills() {
    const { roleData } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [selectedBill, setSelectedBill] = useState(null);

    // Load all this patient's bills
    const { data: bills = [], isLoading, isError } = useQuery({
        queryKey: ['bills', roleData.id],
        queryFn: () =>
            axios
                .get(`${API_URL}/pharmacies/bills`, {
                    params: { patientId: roleData.id },
                    withCredentials: true,
                })
                .then(res => res.data),
        enabled: !!roleData.id,
    });

    // Separate unpaid vs paid
    const unpaidBills = bills.filter(bill => !bill.paid);
    const paidBills = bills.filter(bill => bill.paid);

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Failed to load bills</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            {/* Outstanding Bills */}
            <Typography variant="h5" gutterBottom>
                Outstanding Bills
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {unpaidBills.length === 0 ? (
                <Typography>No outstanding bills</Typography>
            ) : (
                <Stack spacing={2}>
                    {unpaidBills.map(bill => (
                        <Box
                            key={bill.id}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <Typography>
                                #{bill.id} — ${bill.amount.toFixed(2)} due {bill.dueDate}
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => setSelectedBill(bill)}
                            >
                                Pay
                            </Button>
                        </Box>
                    ))}
                </Stack>
            )}

            {/* Payment portal for selected bill */}
            {selectedBill && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <PatientPaymentPortal
                        billId={selectedBill.id}
                        billAmount={selectedBill.amount}
                        onPaymentSuccess={() => setSelectedBill(null)}
                    />
                </>
            )}

            {/* Payment History */}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
                Payment History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {paidBills.length === 0 ? (
                <Typography>No payments made yet</Typography>
            ) : (
                <Stack spacing={2}>
                    {paidBills.map(bill => (
                        <Box
                            key={bill.id}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <Typography>
                                #{bill.id} — ${bill.amount.toFixed(2)} paid
                            </Typography>
                            {/* You could show bill.paidDate if available */}
                        </Box>
                    ))}
                </Stack>
            )}
        </Paper>
    );
}
