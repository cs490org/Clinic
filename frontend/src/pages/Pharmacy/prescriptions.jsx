import React, { useContext, useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    TextField,
    CardMedia
} from '@mui/material';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext';

const Prescriptions = () => {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        if (!user?.id) return; // wait for user to be loaded

        async function run() {
            try {
                // Fetch pharmacy info
                const pharmacyRes = await fetch(`${API_URL}/pharmacies?userId=${user.id}`, {
                    credentials: 'include'
                });

                if (!pharmacyRes.ok) {
                    console.error("Failed to fetch pharmacy");
                    setLoading(false);
                    return;
                }

                const pharmacyData = await pharmacyRes.json();
                console.log("Pharmacy:", pharmacyData);

                // If array, pick first item
                const pharmacyId = Array.isArray(pharmacyData)
                    ? pharmacyData[0]?.id
                    : pharmacyData?.id;

                if (!pharmacyId) {
                    console.warn("No pharmacy found for this user.");
                    setLoading(false);
                    return;
                }

                // Fetch prescriptions for this pharmacy
                const drugsRes = await fetch(`${API_URL}/pharmacies/drugs?pharmacyId=${pharmacyId}`, {
                    credentials: 'include'
                });

                if (!drugsRes.ok) {
                    console.error("Failed to fetch prescriptions");
                    setLoading(false);
                    return;
                }

                const drugData = await drugsRes.json();
                console.log("Drugs:", drugData);
                setPrescriptions(drugData);
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }

        run();
    }, [user]);

    const handleDispense = (id) => {
        console.log(`Mark pill ${id} as dispensed`);
    };

    const handleQuantityChange = (id, value) => {
        console.log(`Update quantity of pill ${id} to ${value}`);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6">Loading prescriptions...</Typography>
            </Container>
        );
    }

    if (!prescriptions.length) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6">No prescriptions found for this pharmacy.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Prescription Inventory
            </Typography>

            <Grid container spacing={4}>
                {prescriptions.map((pill) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={pill.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={pill.imageUrl}
                                alt={`${pill.name} image`}
                                sx={{ borderRadius: 1 }}
                            />

                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {pill.name}
                                </Typography>

                                <TextField
                                    label="Quantity"
                                    type="number"
                                    defaultValue={pill.quantity}
                                    size="small"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    onChange={(e) => handleQuantityChange(pill.id, e.target.value)}
                                />

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Expiration: {new Date(pill.expirationDate).toLocaleDateString()}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color={pill.dispensed ? 'green' : 'warning.main'}
                                    fontWeight="bold"
                                >
                                    {pill.dispensed ? 'Dispensed' : 'Not Dispensed'}
                                </Typography>
                            </CardContent>

                            <Box textAlign="center" pb={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={pill.dispensed}
                                    onClick={() => handleDispense(pill.id)}
                                    fullWidth
                                >
                                    Mark as Dispensed
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Prescriptions;
