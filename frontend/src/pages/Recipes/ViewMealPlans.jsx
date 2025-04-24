import {Container, Paper, Stack, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useContext, useEffect, useState} from "react";
import {API_URL} from "../../utils/constants.js";
import RecipeCard from "./RecipeCard.jsx";
import Box from "@mui/material/Box";
import {UserContext} from "../../contexts/UserContext.jsx";

export default function ViewMealPlans(){
    const {user, roleData} = useContext(UserContext)
    const [mealPlans, setMealPlans] = useState([])

    useEffect(() => {
        const run = async () => {
            const response = await fetch(API_URL + `/mealplans/patient/${roleData.id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            if(response.ok){
                const data = await response.json()
                setMealPlans(data)
            }
        }
        run()
    }, []);

    const MealPlanCard = ({breakfast,lunch,dinner}) => {
        return (
            <Box>
                <Stack alignItems={"center"} spacing={4}>
                    <Paper sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <Typography sx={{fontWeight:"bold", fontSize:"1.8rem"}}>
                            Breakfast
                        </Typography>
                        <RecipeCard
                        id={breakfast.id}
                        author={breakfast.author}
                        createTimestamp={breakfast.createTimestamp}
                        recipeName={breakfast.name}
                        description={breakfast.description}
                        image={breakfast.img_uri}
                        instructions={breakfast.instructions}
                        reduced={true}
                        />
                    </Paper>

                    <Paper sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <Typography sx={{fontWeight:"bold", fontSize:"1.8rem"}}>
                            Lunch
                        </Typography>
                        <RecipeCard
                            id={lunch.id}
                            author={lunch.author}
                            createTimestamp={lunch.createTimestamp}
                            recipeName={lunch.name}
                            description={lunch.description}
                            image={lunch.img_uri}
                            instructions={lunch.instructions}
                            reduced={true}
                        />
                    </Paper>

                    <Paper sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <Typography sx={{fontWeight:"bold", fontSize:"1.8rem"}}>
                            Dinner
                        </Typography>
                        <RecipeCard
                            id={dinner.id}
                            author={dinner.author}
                            createTimestamp={dinner.createTimestamp}
                            recipeName={dinner.name}
                            description={dinner.description}
                            image={dinner.img_uri}
                            instructions={dinner.instructions}
                            reduced={true}
                        />
                    </Paper>
                </Stack>
            </Box>
        )
    }

    return (
        <Container>
            <Typography sx={{fontWeight:"bold",fontSize:"2rem", textAlign:"center" , mb:"2rem"}}>
                Assigned Meal Plan
            </Typography>
            {
                mealPlans.length==0 ?
                <Typography> You currently have no assigned meal plans.</Typography>

                :
                mealPlans.map((mealPlan,i)=>{

                    return <MealPlanCard
                        key={i}
                    breakfast={mealPlan.breakfast}
                    lunch={mealPlan.lunch}
                    dinner={mealPlan.dinner}
                    />
                })
            }
        </Container>
    )
}