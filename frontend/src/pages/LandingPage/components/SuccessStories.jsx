import {Box, Typography, Avatar, Grid, Container, Stack, Paper} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {API_URL} from "../../../utils/constants.js";

const TestimonialCard = ({initial, title, review}) => (
    <Paper sx={{p: 2, minWidth:"333px"}}>
        <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{bgcolor: 'grey.800', mr: 2}}>{initial}</Avatar>
            <Box>
                <Typography fontWeight="medium">Anonymous User</Typography>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
            </Box>
        </Box>
        <Typography color="text.secondary">{review}</Typography>
    </Paper>
);


const SuccessStories = () => {
    const [reviews,setReviews ] = useState([]);

    useEffect(() => {
        const fetchReviews= async () => {
            const response = await fetch(`${API_URL}/doctors/reviews`);
            const data = await response.json();
            setReviews([...data]);
        };

        fetchReviews();
    }, []);

    return (
        <Box
            sx={{
                py: {xs: 6, md: 10},
                px: {xs: 2, sm: 4, md: 6},
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    component="h2"
                    textAlign="center"
                    fontSize={{xs: "2rem", md: "3.5rem"}}
                    fontWeight="bold"
                    mb={3}
                >
                    Reviews
                </Typography>

                <Typography
                    textAlign="center"
                    fontSize={{xs: "1rem", md: "1.25rem"}}
                    mb={8}
                    maxWidth="800px"
                    mx="auto"
                >
                    Hear from our patients who have achieved their health and weight loss goals.
                </Typography>


                {/*<Stack direction={"row"}>*/}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        overflowX: 'scroll',
                        flexWrap: 'nowrap',
                    }}
                >
                    {reviews.map((review, index) => (
                        <TestimonialCard key={index} initial={""} title={review.title} review={review.review} />
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default SuccessStories;