import {
    Avatar, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, CircularProgress,
    Collapse,
    Divider, IconButton, Stack, TextField,
    Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import dayjs from "dayjs";
import { API_URL } from "../../utils/constants.js";
import { toast } from "sonner";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys.js";
import {Circle} from "@mui/icons-material";

export default function ViewSingleRecipe({id}) {

    const [recipe, setRecipe] = useState([])
    useEffect(() => {
        const run = async () => {
            const response = await fetch(API_URL + "/recipes?id=" + id,
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            const data = await response.json()
            setRecipe(data)
        }
        run()
    }, [id]);


    const getIngredientDTOs = async () => {
        try {
            const response = await fetch(API_URL + "/recipes/ingredients?recipeId=" + recipe.id,
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            const data = await response.json()
            return data
        } catch (e) {
            toast.error("Something went wrong when trying to get ingredients.")
            console.log(e)
        }
    }

    const { data: ingredientDTOs, isLoading: ingredientsIsLoading } = useQuery({
        queryKey: queryKeys.recipes.ingredients(recipe.id),
        queryFn: getIngredientDTOs,
        enabled:!!recipe?.id
    })

    if(ingredientsIsLoading){
        return <CircularProgress/>
    }

    return (
        <Card variant={"elevation"} elevation={1} sx={{ minWidth: 350, maxWidth: 600 }}>
            <CardHeader
                avatar={
                    <Avatar>
                        D
                    </Avatar>
                }
                title={
                    <Typography>
                        {recipe.author}
                    </Typography>
                }
                subheader={dayjs(recipe.createTimestamp).format('MMMM D, YYYY')}
            />
            <CardMedia
                component="img"
                sx={{height:"200px"}}
                image={recipe.img_uri}
                alt={recipe.img_uri}
            />
            <CardContent>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {recipe.name}
                </Typography>
                {/*<Divider />*/}
                <Typography sx={{ color: "text.secondary", fontSize: ".95rem" }}>
                    {recipe.description}
                </Typography>
                <Divider></Divider>

                <Typography mt="1rem" fontWeight={"medium"} fontSize={"1.1rem"}>
                    Nutrition information:
                </Typography>
                {
                    ["fats", "carbs", "protein"].map((category, i) =>
                        <Typography>
                            {
                                ingredientDTOs?.reduce((acc, ingredientDTO) => { return acc + ingredientDTO.ingredient[category] * ingredientDTO.quantity }, 0)
                                + `g ${category}`
                            }
                        </Typography>
                    )
                }
                <Divider></Divider>
                <Typography>
                    {
                        ingredientDTOs?.reduce((acc, ingredientDTO) => { return acc + ingredientDTO.ingredient.calories * ingredientDTO.quantity }, 0)
                        + " calories"
                    }
                </Typography>

                {!ingredientsIsLoading && ingredientDTOs &&
                    <>
                        <Typography mt="1rem" fontWeight={"medium"} fontSize={"1.1rem"}>
                            Ingredients:
                        </Typography>
                        {ingredientDTOs.map((ingredientDTO, i) => {
                            return (
                                <Typography key={i}> {ingredientDTO.quantity} x {ingredientDTO.ingredient.name}</Typography>
                            )
                        })}

                    </>
                }
                {recipe.instructions &&
                    (
                        <>
                            <Typography mt={"1rem"} fontWeight={"medium"} fontSize={"1.1rem"}>Instructions:</Typography>
                            <Typography>{recipe.instructions}</Typography>
                        </>
                    )
                }
            </CardContent>
        </Card>
    )
}
