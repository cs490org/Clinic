// src/pages/Patient/PaymentPortal.jsx

import { useContext, useEffect, useState } from 'react';
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
    Stack,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';

export default function PatientPaymentPortal({ billId, billAmount, onPaymentSuccess }) {
    const { roleData } = useContext(UserContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Don't render if no bill selected
    if (billId == null || billAmount == null) return null;

    const [selectedCardId, setSelectedCardId] = useState(null);

    // Fetch saved cards
    const { data: cards = [], isLoading, isError } = useQuery({
        queryKey: ['creditCards', roleData.id],
        queryFn: () =>
            axios
                .get(`${API_URL}/credit-cards`, {
                    params: { patientId: roleData.id },
                    withCredentials: true,
                })
                .then(res => res.data),
        enabled: !!roleData.id,
        staleTime: 300_000,
    });

    // Auto-select first card
    useEffect(() => {
        if (cards.length > 0 && selectedCardId === null) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId]);

    // Mark bill paid
    const markPaid = useMutation({
        mutationFn: () =>
            axios.patch(
                `${API_URL}/pharmacies/bill`,
                null,
                {
                    params: { billId },
                    withCredentials: true,
                }
            ),
        onSuccess: () => {
            toast.success('Bill paid successfully!');
            queryClient.invalidateQueries({ queryKey: ['bills', roleData.id] });
            onPaymentSuccess?.();
            setSelectedCardId(null);
        },
        onError: () => toast.error('Failed to mark bill paid'),
    });

    const handlePay = () => {
        if (selectedCardId === null) {
            toast.error('Please select a card');
            return;
        }
        markPaid.mutate();
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
                            {cards.length > 0 ? (
                                cards.map(card => (
                                    <FormControlLabel
                                        key={card.id}
                                        value={card.id.toString()}
                                        control={<Radio />}
                                        label={`•••• •••• •••• ${card.last4Digits} exp ${card.expirationDate}`}
                                    />
                                ))
                            ) : (
                                <Typography>No saved cards.</Typography>
                            )}
                        </RadioGroup>
                    </FormControl>

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/patient/add_payment')}
                    >
                        + Add New Card
                    </Button>
                </Stack>
            )}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePay}
                disabled={markPaid.isLoading || isLoading || cards.length === 0}
            >
                {markPaid.isLoading ? <CircularProgress size={24} /> : `Pay $${billAmount.toFixed(2)}`}
            </Button>
        </Paper>
    );
}