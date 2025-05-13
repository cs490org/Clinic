import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Button,
    Divider,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { toast } from 'sonner';
import { UserContext } from '../../contexts/UserContext.jsx';
import { API_URL, PHARMACY_API_URL } from '../../utils/constants.js';

export default function ReverseFulfillment() {
    const { user } = useContext(UserContext);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch fulfilled prescriptions
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            // get pharmacy ID
            const pharmRes = await axios.get(
                `${PHARMACY_API_URL}/pharmacies`,
                { params: { userId: user.id }, withCredentials: true }
            );
            const pharm = Array.isArray(pharmRes.data) ? pharmRes.data[0] : pharmRes.data;
            const pharmacyId = pharm?.id;
            if (!pharmacyId) throw new Error('No pharmacy found');

            // fetch all prescriptions for this pharmacy
            const presRes = await axios.get(
                `${PHARMACY_API_URL}/pharmacies/rx`,
                { params: { pharmacyId }, withCredentials: true }
            );
            // filter only fulfilled
            const fulfilled = (presRes.data || []).filter(
                rx => rx.rxStatusCode === 'FULFILLED'
            ).reverse();
            setPrescriptions(fulfilled);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        if (user?.id) fetchData();
    }, [user.id, fetchData]);

    // Reverse fulfillment handler
    const handleReverse = async rx => {
        try {
            // get pharmacyId again
            const pharmRes = await axios.get(
                `${PHARMACY_API_URL}/pharmacies`,
                { params: { userId: user.id }, withCredentials: true }
            );
            const pharm = Array.isArray(pharmRes.data) ? pharmRes.data[0] : pharmRes.data;
            const pharmacyId = pharm?.id;
            if (!pharmacyId) throw new Error('No pharmacy found');

            // 1) dispense-log with negative quantity
            await axios.post(
                `${API_URL}/dispenselog/log`,
                {
                    pharmacyId,
                    drugId: rx.drug.id,
                    quantity: -1
                },
                { withCredentials: true }
            );

            // 2) patch status back to READY_FOR_PICKUP
            await axios.patch(
                `${PHARMACY_API_URL}/${rx.id}/status`,
                null,
                { params: { status: 'READY_FOR_PICKUP' }, withCredentials: true }
            );

            toast.success('Reverted to Ready for Pickup');
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error('Could not reverse fulfillment');
        }
    };

    if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 4 }}><Typography color="error">Failed to load data</Typography></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Reverse Fulfilled Prescriptions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {prescriptions.length === 0 ? (
                <Typography>No fulfilled prescriptions to reverse</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Patient</strong></TableCell>
                                <TableCell><strong>Drug</strong></TableCell>
                                <TableCell><strong>Fulfilled On</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {prescriptions.map((rx, idx) => {
                                const patient = rx.patient?.user;
                                if (!patient) return null;
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {patient.firstName} {patient.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {rx.drug?.name || 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            {rx.updateTimestamp.slice(0, 10)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleReverse(rx)}
                                            >
                                                Reverse
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}
