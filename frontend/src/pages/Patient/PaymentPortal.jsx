import { useState, useContext, useEffect } from 'react';
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
    TextField,
    Button,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';

export default function PatientPaymentPortal() {
    const { roleData } = useContext(UserContext);
    const queryClient = useQueryClient();

    const [amount, setAmount] = useState('');
    const [selectedCardId, setSelectedCardId] = useState(null);

    // 1️⃣ Fetch saved cards, only after we have a patientId
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
        staleTime: 5 * 60 * 1000,
    });

    // 2️⃣ Default‐select the first card when they load
    useEffect(() => {
        if (cards.length > 0 && selectedCardId === null) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId]);

    // 3️⃣ Mutation to perform the payment
    const makePayment = useMutation({
        mutationFn: () =>
            axios.post(
                `${API_URL}/payments`,
                {
                    patientId: roleData.id,
                    amount: parseFloat(amount),
                    cardId: selectedCardId,
                },
                { withCredentials: true }
            ),
        onSuccess: () => {
            toast.success('Payment successful!');
            setAmount('');
            setSelectedCardId(null);
            queryClient.invalidateQueries({ queryKey: ['payments', roleData.id] });
        },
        onError: () => toast.error('Payment failed'),
    });

    const handleSubmit = () => {
        if (!amount || selectedCardId === null) {
            toast.error('Enter an amount and select a card');
            return;
        }
        makePayment.mutate();
    };

    return (
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
                Make a Payment
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {isLoading ? (
                <CircularProgress />
            ) : isError ? (
                <Typography color="error">Failed to load cards.</Typography>
            ) : (
                <FormControl component="fieldset" sx={{ mb: 2 }}>
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
                                    label={`•••• •••• •••• ${card.last4Digits}  exp ${card.expirationDate}`}
                                />
                            ))
                        ) : (
                            <Typography>No saved cards. Please add one in your profile.</Typography>
                        )}
                    </RadioGroup>
                </FormControl>
            )}

            <TextField
                label="Amount ($)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                sx={{ mb: 2 }}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={makePayment.isLoading || isLoading || cards.length === 0}
            >
                {makePayment.isLoading ? <CircularProgress size={24} /> : 'Pay Now'}
            </Button>
        </Paper>
    );
}
