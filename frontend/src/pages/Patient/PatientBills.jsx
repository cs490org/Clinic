// src/pages/Patient/PatientBills.jsx

import React, { useContext, useState } from 'react';
import {
    Paper,
    Typography,
    Divider,
    CircularProgress,
    Box,
    Button,
    Stack
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL, PHARMACY_API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';
import PatientPaymentPortal from './PaymentPortal.jsx';

export default function PatientBills() {
    const { roleData } = useContext(UserContext);
    const [selectedBill, setSelectedBill] = useState(null);

    const { data: bills = [], isLoading, isError } = useQuery({
        queryKey: ['bills', roleData.id],
        queryFn: () =>
            axios
                .get(`${PHARMACY_API_URL}/pharmacies/bills`, {
                    params: { patientId: roleData.id },
                    withCredentials: true,
                })
                .then(res => res.data),
        enabled: !!roleData.id,
    });

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Failed to load bills</Typography>;

    const outstanding = bills.filter(b => !b.paid);
    const history     = bills.filter(b => b.paid).slice().reverse();

    return (
        <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h5" gutterBottom>
                Outstanding Bills
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {outstanding.length === 0 ? (
                <Typography>No outstanding bills</Typography>
            ) : (
                <Stack spacing={2}>
                    {outstanding.map(bill => (
                        <Box
                            key={bill.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Stack
                                component="article"
                                spacing={1}
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: '#ffa8a8',
                                    boxShadow: 1,
                                    mr: 2
                                }}
                                role="group"
                                aria-label={`
                  Prescription ${bill.prescription.drug.name}.
                  Updated on ${bill.prescription.updateTimestamp.slice(0,10)}.
                  Amount ${bill.amount.toFixed(2)} due ${bill.prescription.rxExpiryTimestamp.slice(0,10)}.
                  Status ${bill.prescription.rxStatusCode.replace(/_/g,' ')}
                `}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: '1.2rem', fontWeight: 700 }}
                                >
                                    {bill.prescription.drug.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    <strong>Date:</strong>{' '}
                                    {bill.prescription.updateTimestamp.slice(0, 10)}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    <strong>Amount:</strong>{' '}
                                    ${bill.amount.toFixed(2)}{' '}
                                    <strong>Due:</strong>{' '}
                                    {bill.prescription.rxExpiryTimestamp.slice(0, 10)}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    <strong>Status:</strong>{' '}
                                    {bill.prescription.rxStatusCode.replace(/_/g, ' ')}
                                </Typography>
                            </Stack>

                            <Button
                                variant="contained"
                                size="large"
                                sx={{ py: 1.5, px: 4, fontSize: '2rem' }}
                                onClick={() => setSelectedBill(bill)}
                            >
                                Pay
                            </Button>
                        </Box>
                    ))}
                </Stack>
            )}

            {selectedBill && (
                <>
                    <Divider sx={{ my: 4 }} />
                    <PatientPaymentPortal
                        billId={selectedBill.id}
                        billAmount={selectedBill.amount}
                        prescriptionId={selectedBill.prescription.id}
                        drugId={selectedBill.prescription.drug.id}
                        onPaymentSuccess={() => setSelectedBill(null)}
                    />
                </>
            )}

            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
                Payment History
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {history.length === 0 ? (
                <Typography>No payment history</Typography>
            ) : (
                <Stack spacing={2}>
                    {history.map(bill => (
                        <Box
                            key={bill.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <Stack
                                component="article"
                                spacing={1}
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1
                                }}
                                role="group"
                                aria-label={`
                  Prescription ${bill.prescription.drug.name}.
                  Updated on ${bill.prescription.updateTimestamp.slice(0,10)}.
                  Amount ${bill.amount.toFixed(2)} paid on ${bill.prescription.updateTimestamp.slice(0,10)}.
                  Status ${bill.prescription.rxStatusCode.replace(/_/g,' ')}
                `}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: '1.2rem', fontWeight: 700 }}
                                >
                                    {bill.prescription.drug.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    <strong>Date:</strong>{' '}
                                    {bill.prescription.updateTimestamp.slice(0, 16).replace('T', ' ')}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    <strong>Amount:</strong>{' '}
                                    ${bill.amount.toFixed(2)}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    <strong>Status:</strong>{' '}
                                    {bill.prescription.rxStatusCode.replace(/_/g, ' ')}
                                </Typography>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Paper>
    );
}
