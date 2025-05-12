// src/pages/Patient/PaymentPortal.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    Divider,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Stack
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';

export default function PatientPaymentPortal({ billId, billAmount, prescriptionId, onPaymentSuccess }) {
    const { roleData } = useContext(UserContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    if (!billId || !prescriptionId) return null;

    const [selectedCardId, setSelectedCardId] = useState(null);

    const { data: cards = [], isLoading, isError } = useQuery({
        queryKey: ['creditCards', roleData.id],
        queryFn: () =>
            axios.get(`${API_URL}/credit-cards`, {
                params: { patientId: roleData.id },
                withCredentials: true
            }).then(res => res.data),
        enabled: !!roleData.id,
    });

    useEffect(() => {
        if (cards.length > 0 && selectedCardId === null) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId]);

    // Disable if selected card is expired
    const selectedCard = cards.find(c => c.id === selectedCardId);
    const isExpired = (() => {
        if (!selectedCard?.expirationDate) return false;
        const [m, y] = selectedCard.expirationDate.split('/');
        const expMonth = parseInt(m, 10);
        const expYear = 2000 + parseInt(y, 10);
        const now = new Date();
        const nowMonth = now.getMonth() + 1;
        const nowYear = now.getFullYear();
        return expYear < nowYear || (expYear === nowYear && expMonth < nowMonth);
    })();

    const payAndReady = useMutation({
        mutationFn: async () => {
            await axios.patch(
                `${API_URL}/pharmacies/bill`,
                null,
                { params: { billId }, withCredentials: true }
            );
            return axios.patch(
                `${API_URL}/${prescriptionId}/status`,
                null,
                { params: { status: 'READY_FOR_PICKUP' }, withCredentials: true }
            );
        },
        onSuccess: () => {
            toast.success('Payment recorded and prescription is ready for pickup');
            queryClient.invalidateQueries(['bills', roleData.id]);
            onPaymentSuccess();
            setSelectedCardId(null);
        },
        onError: () => toast.error('Payment or status update failed'),
    });

    const handlePay = () => {
        if (!selectedCardId) {
            toast.error('Select a card');
            return;
        }
        payAndReady.mutate();
    };

    return (
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
                Pay ${billAmount.toFixed(2)}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
                <CircularProgress />
            ) : isError ? (
                <Typography color="error" sx={{ mb: 2 }}>
                    Failed to load cards.
                </Typography>
            ) : (
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select a Card</FormLabel>
                        <RadioGroup
                            value={selectedCardId?.toString() || ''}
                            onChange={e => setSelectedCardId(Number(e.target.value))}
                        >
                            {cards.map(card => (
                                <FormControlLabel
                                    key={card.id}
                                    value={card.id.toString()}
                                    control={<Radio />}
                                    label={`•••• •••• •••• ${card.last4Digits} exp ${card.expirationDate}`}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Button variant="outlined" size="small" onClick={() => navigate('/patient/add_payment')}>
                        + Add New Card
                    </Button>
                </Stack>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePay}
                disabled={isLoading || cards.length === 0 || payAndReady.isLoading || isExpired}
            >
                {payAndReady.isLoading ? <CircularProgress size={24} /> : `Pay $${billAmount.toFixed(2)}`}
            </Button>
        </Paper>
    );
}