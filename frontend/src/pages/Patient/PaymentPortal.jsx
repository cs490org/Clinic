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
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { API_URL, PHARMACY_API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.jsx';

export default function PatientPaymentPortal({
                                                 billId,
                                                 billAmount,
                                                 prescriptionId,
                                                 drugId,
                                                 onPaymentSuccess,
                                             }) {
    const { roleData } = useContext(UserContext);
    const queryClient = useQueryClient();
    if (!billId || !prescriptionId || !drugId) return null;

    const [selectedCardId, setSelectedCardId] = useState(null);
    const [addOpen, setAddOpen] = useState(false);

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
    });

    useEffect(() => {
        if (cards.length > 0 && selectedCardId === null) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId]);

    const selectedCard = cards.find(c => c.id === selectedCardId);
    const isExpired = (() => {
        if (!selectedCard?.expirationDate) return false;
        const [m, y] = selectedCard.expirationDate.split('/');
        const expMonth = parseInt(m, 10);
        const expYear = 2000 + parseInt(y, 10);
        const now = new Date();
        return expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1);
    })();

    const payAndReady = useMutation({
        mutationFn: async () => {
            // 1) Pay the bill
            await axios.patch(
                `${PHARMACY_API_URL}/pharmacies/bill`,
                null,
                { params: { billId }, withCredentials: true }
            );

            // 2) Fetch preferred pharmacy
            const { data: pharmacy } = await axios.get(
                `${API_URL}/patient/${roleData.id}/pharmacy`,
                { withCredentials: true }
            );
            const pharmacyId = pharmacy.id;

            // 3) Fetch inventory
            const { data: inventoryList } = await axios.get(
                `${PHARMACY_API_URL}/pharmacies/drugs`,
                { params: { pharmacyId }, withCredentials: true }
            );
            const entry = inventoryList.find(d => d.drug.id === drugId);
            const currentQty = entry?.inventory ?? 0;

            let statusUpdated = false;
            if (currentQty > 0) {
                // 4) Decrement inventory
                await axios.patch(
                    `${PHARMACY_API_URL}/pharmacies/drugs/inventory`,
                    {
                        pharmacyId,
                        drugId,
                        quantity: currentQty - 1,
                        dispensed: false,
                    },
                    { withCredentials: true }
                );
                // 5) Update prescription status using the prescriptionId
                await axios.patch(
                    `${PHARMACY_API_URL}/${prescriptionId}/status`,
                    null,
                    { params: { status: 'READY_FOR_PICKUP' }, withCredentials: true }
                );
                statusUpdated = true;
            }

            return { statusUpdated };
        },
        onSuccess: ({ statusUpdated }) => {
            toast.success(
                statusUpdated
                    ? 'Payment complete. Prescription ready for pickup.'
                    : 'Payment complete. We will notify you as soon as the prescription is ready for pickup.'
            );
            queryClient.invalidateQueries(['bills', roleData.id]);
            onPaymentSuccess();
            setSelectedCardId(null);
        },
        onError: err => {
            console.error(err);
            toast.error('Payment or inventory update failed');
        },
    });

    const handlePay = () => {
        if (!selectedCardId) {
            toast.error('Select a card');
            return;
        }
        payAndReady.mutate();
    };

    // Card-add form state & validation unchanged...
    const [cardForm, setCardForm] = useState({
        patientId: roleData.id,
        cardHolderName: '',
        cardNumber: '',
        expirationDate: '',
        street: '',
        city: '',
        state: '',
        zip: '',
    });
    const [cardErrors, setCardErrors] = useState({});
    const validators = {
        cardHolderName: v =>
            /^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+$/.test(v.trim()) ? '' : 'First and last name, ex. Jon Doe',
        cardNumber: v =>
            /^\d{13,19}$/.test(v.replace(/\s+/g, '')) ? '' : 'Invalid card number',
        expirationDate: v =>
            /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? '' : 'MM/YY',
        street: v =>
            /^\d+ [A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*$/.test(v.trim()) ? '' : 'e.g. 123 Main St',
        city: v =>
            /^[A-Z][a-zA-Z]{2,}(?:[ -][A-Za-z]{2,})*$/.test(v.trim()) ? '' : 'e.g. Springfield',
        state: v => /^[A-Z]{2}$/.test(v.trim()) ? '' : 'e.g. CA',
        zip: v => /^\d{5}$/.test(v) ? '' : '5 digits',
    };

    const handleCardChange = e => {
        const { name, value } = e.target;
        setCardForm(f => ({ ...f, [name]: value }));
        setCardErrors(err => ({ ...err, [name]: validators[name](value) }));
    };

    const isCardFormValid = Object.keys(validators).every(
        field => validators[field](cardForm[field]) === ''
    );

    const handleCardSubmit = async e => {
        e.preventDefault();
        const errors = {};
        if (!cardForm.cardHolderName.trim()) errors.cardHolderName = 'Required';
        if (validators.cardNumber(cardForm.cardNumber)) errors.cardNumber = 'Invalid';
        if (validators.expirationDate(cardForm.expirationDate)) errors.expirationDate = 'MM/YY';
        if (!cardForm.street.trim()) errors.street = 'Required';
        if (!cardForm.city.trim()) errors.city = 'Required';
        if (!cardForm.state.trim()) errors.state = 'Required';
        if (validators.zip(cardForm.zip)) errors.zip = '5 digits';
        setCardErrors(errors);
        if (Object.keys(errors).length) return;

        const billingAddress = `${cardForm.street}, ${cardForm.city}, ${cardForm.state} ${cardForm.zip}`;
        try {
            const res = await fetch(`${API_URL}/credit-cards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    patientId: roleData.id,
                    cardHolderName: cardForm.cardHolderName,
                    cardNumber: cardForm.cardNumber,
                    expirationDate: cardForm.expirationDate,
                    billingAddress,
                }),
            });
            if (!res.ok) throw new Error();
            toast.success('Card saved!');
            setAddOpen(false);
            queryClient.invalidateQueries(['creditCards', roleData.id]);
            setCardForm({
                patientId: roleData.id,
                cardHolderName: '',
                cardNumber: '',
                expirationDate: '',
                street: '',
                city: '',
                state: '',
                zip: '',
            });
        } catch {
            toast.error('Failed to save card');
        }
    };

    return (
        <>
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
                            {selectedCard && isExpired && (
                                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                    ⚠️ This card is expired. Please select another or add a new one.
                                </Typography>
                            )}
                        </FormControl>
                        <Button variant="outlined" size="small" onClick={() => setAddOpen(true)}>
                            + Add New Card
                        </Button>
                    </Stack>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePay}
                    disabled={payAndReady.isLoading || isLoading || cards.length === 0 || isExpired}
                >
                    {payAndReady.isLoading ? <CircularProgress size={24} /> : `Pay $${billAmount.toFixed(2)}`}
                </Button>
            </Paper>

            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Card</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleCardSubmit} sx={{ mt: 1 }}>
                        <Stack spacing={2}>
                            <TextField
                                name="cardHolderName"
                                label="Cardholder Name"
                                fullWidth
                                value={cardForm.cardHolderName}
                                onChange={handleCardChange}
                                error={!!cardErrors.cardHolderName}
                                helperText={cardErrors.cardHolderName}
                            />
                            <TextField
                                name="cardNumber"
                                label="Card Number"
                                fullWidth
                                inputProps={{ maxLength: 19 }}
                                value={cardForm.cardNumber}
                                onChange={handleCardChange}
                                error={!!cardErrors.cardNumber}
                                helperText={cardErrors.cardNumber}
                            />
                            <TextField
                                name="expirationDate"
                                label="Expiration Date (MM/YY)"
                                fullWidth
                                value={cardForm.expirationDate}
                                onChange={handleCardChange}
                                error={!!cardErrors.expirationDate}
                                helperText={cardErrors.expirationDate}
                            />
                            <TextField
                                name="street"
                                label="Street Address"
                                fullWidth
                                value={cardForm.street}
                                onChange={handleCardChange}
                                error={!!cardErrors.street}
                                helperText={cardErrors.street}
                            />
                            <TextField
                                name="city"
                                label="City"
                                fullWidth
                                value={cardForm.city}
                                onChange={handleCardChange}
                                error={!!cardErrors.city}
                                helperText={cardErrors.city}
                            />
                            <TextField
                                name="state"
                                label="State"
                                fullWidth
                                value={cardForm.state}
                                onChange={handleCardChange}
                                error={!!cardErrors.state}
                                helperText={cardErrors.state}
                            />
                            <TextField
                                name="zip"
                                label="ZIP Code"
                                fullWidth
                                inputProps={{ maxLength: 5 }}
                                value={cardForm.zip}
                                onChange={handleCardChange}
                                error={!!cardErrors.zip}
                                helperText={cardErrors.zip}
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button onClick={handleCardSubmit} variant="contained" disabled={!isCardFormValid}>
                        Save Card
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}