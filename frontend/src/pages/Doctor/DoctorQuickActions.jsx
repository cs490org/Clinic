import { Paper, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DoctorQuickActions() {
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
                    onClick={() => navigate('/mealplans/assign')}
                >
                    Assign Meal Plan
                </Button>
            </Stack>
        </Paper>
    );
}