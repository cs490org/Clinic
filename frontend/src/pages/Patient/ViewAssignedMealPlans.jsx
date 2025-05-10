import {queryKeys} from "../../utils/queryKeys.js";
import {useQuery} from "@tanstack/react-query";
import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {toast} from "sonner";
import {Container, Divider, Grid2, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import FoodNav from "../FoodNav.jsx";
import MealPlanCard from "../MealPlans/MealPlanCard.jsx";
import {API_URL} from "../../utils/constants.js";

export default function ViewAssignedMealPlans(){
    const {roleData} = useContext(UserContext)
    const {data:mealPlans,isLoading} = useQuery({
        queryKey:queryKeys.mealplans.assigned,
        queryFn:async () => {
            try{
                const response = await fetch(API_URL + `/mealplans/patient/${roleData.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                )
                const data = await response.json()
                return data
            }catch(e){
                toast.error("Something went wrong when trying to get mealplans.")
                console.log(e)
            }
        }
    })


    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"))
    return (
        <>
            <Container>
                <Typography sx={{fontWeight:"bold",fontSize:"2rem" }}>
                    My Meal Plans
                </Typography>
                <Typography variant={"body2"}>
                    Here are your assigned meal plans.
                </Typography>
                <Divider sx={{my:"1rem"}}/>
                {
                    !isLoading && mealPlans.length === 0 ?
                        <Typography> No meal plans have been posted yet</Typography>

                        :
                        (
                            isMdUp ?
                                <Grid2 container spacing={2}>
                                    {
                                        mealPlans?.map((mealPlan, i) => {

                                            return (
                                                <Grid2 key={i} size={4}>
                                                    <MealPlanCard
                                                        key={i}
                                                        id={mealPlan.mealPlan.id}
                                                        name={mealPlan.mealPlan.name}
                                                        author={mealPlan.author}
                                                        breakfast={mealPlan.mealPlan.breakfast}
                                                        lunch={mealPlan.mealPlan.lunch}
                                                        dinner={mealPlan.mealPlan.dinner}
                                                    />
                                                </Grid2>
                                            )
                                        })
                                    }
                                </Grid2>
                                :
                                <Stack container spacing={2}>
                                    {
                                        mealPlans?.map((mealPlan, i) => {

                                            return (
                                                <Grid2 key={i} size={4}>
                                                    <MealPlanCard
                                                        key={i}
                                                        author={mealPlan.author}
                                                        breakfast={mealPlan.mealPlan.breakfast}
                                                        lunch={mealPlan.mealPlan.lunch}
                                                        dinner={mealPlan.mealPlan.dinner}
                                                    />
                                                </Grid2>
                                            )
                                        })
                                    }
                                </Stack>
                        )
                }
            </Container>
        </>
    )
}
