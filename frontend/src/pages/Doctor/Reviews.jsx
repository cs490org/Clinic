import {
    Container,
    Typography,
    Paper,
    Rating,
    Stack,
    Box,
    Divider,
    Avatar,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';

const Reviews = () => {
    const { roleData } = useContext(UserContext);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const [reviewsResponse, ratingResponse] = await Promise.all([
                    axios.get(`${API_URL}/doctors/${roleData.id}/reviews`, { withCredentials: true }),
                    axios.get(`${API_URL}/doctors/${roleData.id}/rating`, { withCredentials: true })
                ]);
                setReviews(reviewsResponse.data);
                setAverageRating(ratingResponse.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                toast.error('Failed to load reviews');
            }
        };

        if (roleData?.id) {
            fetchReviews();
        }
    }, [roleData?.id]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Your Reviews
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Rating value={averageRating} precision={0.5} readOnly />
                        <Typography>({averageRating.toFixed(1)})</Typography>
                    </Box>
                </Box>

                {reviews.length === 0 ? (
                    <Typography>No reviews yet</Typography>
                ) : (
                    reviews.map((review, index) => (
                        <Paper key={review.id} sx={{ p: 2 }}>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar 
                                            src={review.patient?.user?.imgUri} 
                                            alt={`${review.patient?.firstName} ${review.patient?.lastName}`}
                                        />
                                        <Box>
                                            <Typography variant="h6">{review.title}</Typography>
                                            <Typography color="text.secondary">
                                                {review.patient?.firstName} {review.patient?.lastName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Rating value={review.rating} readOnly />
                                </Box>
                                <Typography color="text.secondary">
                                    {new Date(review.createTimestamp).toLocaleDateString()}
                                </Typography>
                                <Typography>{review.review}</Typography>
                            </Stack>
                            {index < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
                        </Paper>
                    ))
                )}
            </Stack>
        </Container>
    );
};

export default Reviews; 