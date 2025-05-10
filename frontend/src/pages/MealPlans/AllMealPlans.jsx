import {Container, Divider, Grid2, Paper, Stack, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useContext, useEffect, useState} from "react";
import {API_URL} from "../../utils/constants.js";
import RecipeCard from "../Recipes/RecipeCard.jsx";
import Box from "@mui/material/Box";
import {UserContext} from "../../contexts/UserContext.jsx";
import {queryKeys} from "../../utils/queryKeys.js";
import {toast} from "sonner";
import MealPlanCard from "./MealPlanCard.jsx";

export default function AllMealPlans(){

    const {data:mealPlans,isLoading} = useQuery({
        queryKey:queryKeys.mealplans.all,
        queryFn:async () => {
            try{
                const response = await fetch(API_URL + `/mealplans`,
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


    return (
        <Container>
            <Typography sx={{fontWeight:"bold",fontSize:"2rem", textAlign:"center" , mb:"2rem"}}>
                Meal Plans
            </Typography>
            {
                !isLoading && mealPlans.length === 0 ?
                    <Typography> No meal plans have been posted yet</Typography>

                    :
                    (
                    <Grid2 container spacing={2}>
                        {
                        mealPlans?.map((mealPlan,i)=>{

                            return(
                                <MealPlanCard
                                    key={i}
                                    author={mealPlan.author}
                                    breakfast={mealPlan.mealPlan.breakfast}
                                    lunch={mealPlan.mealPlan.lunch}
                                    dinner={mealPlan.mealPlan.dinner}
                                />
                            )
                        })
                        }
                    </Grid2>
                    )
            }
        </Container>
    )
}
