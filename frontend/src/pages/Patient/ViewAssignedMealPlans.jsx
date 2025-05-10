import {Container, Divider, Paper, Stack, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useContext, useEffect, useState} from "react";
import {API_URL} from "../../utils/constants.js";
import RecipeCard from "../Recipes/RecipeCard.jsx";
import Box from "@mui/material/Box";
import {UserContext} from "../../contexts/UserContext.jsx";
import {queryKeys} from "../../utils/queryKeys.js";
import {toast} from "sonner";
import MealPlanCard from "../MealPlans/MealPlanCard.jsx";

export default function ViewAssignedMealPlans(){
    const {user, roleData} = useContext(UserContext)

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


    return (
        <Container>
            <Typography sx={{fontWeight:"bold",fontSize:"2rem", textAlign:"center" , mb:"2rem"}}>
                Your meal plans
            </Typography>
            {
                !isLoading && mealPlans.length === 0 ?
                <Typography> You currently have no assigned meal plans.</Typography>

                :
                mealPlans?.map((mealPlan,i)=>{

                    return(
                            <MealPlanCard
                                key={i}
                            breakfast={mealPlan.breakfast}
                            lunch={mealPlan.lunch}
                            dinner={mealPlan.dinner}
                            />
                    )
                })
            }
        </Container>
    )
}