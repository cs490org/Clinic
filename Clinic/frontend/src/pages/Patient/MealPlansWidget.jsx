import { CircularProgress, Paper, Typography, Box, Stack, Button } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys.js";
import { API_URL } from "../../utils/constants.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function MealPlansWidget() {
    const { user, roleData } = useContext(UserContext)
    const navigate = useNavigate();

    const { data: mealPlans, isLoading } = useQuery({
        queryKey: queryKeys.mealplans.all,
        queryFn: async () => {
            try {
                const response = await fetch(API_URL + `/mealplans/patient/${roleData.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                )
                const data = await response.json()
                return data
            } catch (e) {
                toast.error("Something went wrong when trying to get mealplans.")
                console.log(e)
            }
        }
    })

    const MealPlanCard = ({ breakfast, lunch, dinner }) => {
        if(!breakfast || !lunch || !dinner){
            return <CircularProgress></CircularProgress>
        }
        return (
            <Box sx={{ mb: 2 }}>
                <Stack spacing={1}>
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>Breakfast:</Typography>
                        <Typography>{breakfast.name}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>Lunch:</Typography>
                        <Typography>{lunch.name}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>Dinner:</Typography>
                        <Typography>{dinner.name}</Typography>
                    </Box>
                </Stack>
            </Box>
        )
    }

    return (
        <Paper sx={{ height:"100%",p: "1rem" }}>
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
                    Current Meal Plan
                </Typography>
            </Box>
            {isLoading && <CircularProgress />}
            {!isLoading && mealPlans?.length === 0 && (
                <Typography>You currently have no meal plans.</Typography>
            )}
            {/*{mealPlans?.map((mealPlan, i) => (*/}
            {/*    <MealPlanCard*/}
            {/*        key={i}*/}
            {/*        breakfast={mealPlan.mealPlan.breakfast}*/}
            {/*        lunch={mealPlan.mealPlan.lunch}*/}
            {/*        dinner={mealPlan.mealPlan.dinner}*/}
            {/*    />*/}
            {/*))}*/}
            {/* just get the first one. */}
            {!isLoading && mealPlans?.length > 0 &&
            <MealPlanCard
                breakfast={mealPlans[0].mealPlan.breakfast}
                lunch={mealPlans[0].mealPlan.lunch}
                dinner={mealPlans[0].mealPlan.dinner}
            />
            }
            <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/mealplans/assigned')}
            >
                View More
            </Button>
        </Paper>
    )
}