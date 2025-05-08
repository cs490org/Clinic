import { Paper, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PatientQuickActions() {
    const navigate = useNavigate();

    return (
        <Paper sx={{ p: "1rem", height: '100%' }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.4rem", mb: 2 }}>
                Quick Actions
            </Typography>
            <Stack spacing={2}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/patient/symptoms')}
                >
                    Edit my symptoms
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/recipes')}
                >
                    View recipes
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/mealplans')}
                >
                    View meal plans
                </Button>
            </Stack>
        </Paper>
    );
}