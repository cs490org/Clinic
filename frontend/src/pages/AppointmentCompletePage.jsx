import { useContext, useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Stack,
    Rating,
    TextField,
    Box,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export default function AppointmentCompletePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, roleData } = useContext(UserContext);
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [review, setReview] = useState('');

    const { data: appointment, isLoading } = useQuery({
        queryKey: ['appointment', id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/appointments/${id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch appointment');
            return res.json();
        }
    });

    const handleSubmitReview = async () => {
        try {
            const res = await fetch(`${API_URL}/doctors/review/${appointment[0].doctor.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    doctorId: appointment[0].doctor.id,
                    patientId: appointment[0].patient.id,
                    rating,
                    title: reviewTitle,
                    review
                })
            });

            if (!res.ok) throw new Error('Failed to submit review');
            
            toast.success('Review submitted successfully!');
            navigate('/patient/dashboard');
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (user?.role === 'PATIENT') {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Appointment Complete
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Thank you for your appointment with Dr. {appointment[0].doctor?.firstName} {appointment[0].doctor?.lastName}
                    </Typography>
                    
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Rate your experience
                        </Typography>
                        <Rating
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue)}
                            size="large"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Review Title"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Write a review (optional)"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        sx={{ mb: 4 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitReview}
                        disabled={rating === 0 || !reviewTitle.trim()}
                    >
                        Submit Review
                    </Button>
                </Paper>
            </Container>
        );
    }

console.log(appointment);

    // Doctor view
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Appointment Complete
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Appointment with {appointment[0].patient?.firstName} {appointment[0].patient?.lastName} has been completed.
                </Typography>

                <Stack spacing={2} sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/doctor/assignrx?patientId=${appointment[0].patient?.id}`)}
                    >
                        Assign Prescription
                    </Button>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/mealplans/create?patientId=${appointment[0].patient?.id}`)}
                    >
                        Assign Meal Plan
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/doctor/dashboard')}
                    >
                        Return to Dashboard
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
} 