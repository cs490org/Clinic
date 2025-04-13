import React, { useEffect, useState } from 'react';
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

const Prescriptions = () => {
    const [loading, setLoading] = useState(true);
    const [prescriptions, setPrescriptions] = useState([]);


    useEffect(() => {
        async function run() {
            const response = fetch(API_URL + "/prescriptions", {
                // method
                method: "GET",
                credentials: "include"
            })
            if (response.status == 200) {
                const data = await response.json()
            }
        }
        run()
    }, []);

    // Temporary hardcoded data
    const pills = [
        { id: 1, name: "Amoxicillin", quantity: 30, expires: "2025-05-01", dispensed: false },
        { id: 2, name: "Ibuprofen", quantity: 60, expires: "2025-06-15", dispensed: false },
        { id: 3, name: "Zyrtec", quantity: 10, expires: "2025-07-01", dispensed: false },
        { id: 4, name: "Lisinopril", quantity: 90, expires: "2025-08-10", dispensed: false },
        { id: 5, name: "Metformin", quantity: 45, expires: "2025-09-05", dispensed: false },
    ];

    const handleDispense = (id) => {
        console.log(`Mark pill ${id} as dispensed`);
    };

    const handleQuantityChange = (id, value) => {
        console.log(`Update quantity of pill ${id} to ${value}`);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Prescription Inventory
            </Typography>

            <Grid container spacing={4}>
                {pills.slice(0, 5).map((pill, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={pill.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://via.placeholder.com/300x140.png?text=Pill+Image"
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
                                    Expiration: {new Date(pill.expires).toLocaleDateString()}
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
