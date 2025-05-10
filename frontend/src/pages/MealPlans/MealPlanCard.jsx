import RecipeCard from "../Recipes/RecipeCard.jsx";
import {
    Avatar, Button,
    Card, CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, IconButton,
    Paper,
    Stack, TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useContext, useState} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {API_URL} from "../../utils/constants.js";
import {toast} from "sonner";
import {queryKeys} from "../../utils/queryKeys.js";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ViewSingleRecipe from "../Recipes/ViewSingleRecipe.jsx";

export default function MealPlanCard ({author, breakfast,lunch,dinner}){

    const RecipePreview = ({ type, id, author, recipeName, createTimestamp, image, description, instructions}) =>{
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);


        const getIngredientDTOs = async () => {
            try {
                const response = await fetch(API_URL + "/recipes/ingredients?recipeId=" + id,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                )
                const data = await response.json()
                return data
            } catch (e) {
                toast.error("Something went wrong when trying to get ingredients.")
                console.error(e)
                throw(e)
            }
        }

        const { data: ingredientDTOs, isLoading: ingredientsIsLoading } = useQuery({
            queryKey: queryKeys.recipes.ingredients(id),
            queryFn: getIngredientDTOs
        })

        const {data: recipe,isLoading:recipeIsLoading} = useQuery({
            queryKey:queryKeys.recipes.id(id),
            queryFn: async () => {
                try {
                    const response = await fetch(API_URL + "/recipes?id=" + id,
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    )
                    if(!response.ok){
                        throw new Error()
                    }
                    const data = await response.json()
                    return data
                } catch(e){
                   toast.error("Error when trying to get recipe")
                    console.error(e)
                }


            }
        })


        return (
            <>
                <Card variant={"outlined"} elevation={1} sx={{ minWidth: 350, maxWidth: 600 }}>
                    <CardActionArea onClick={handleOpen}>
                        <CardContent>
                            <Stack direction={"row"} justifyContent={"space-between"}>
                               <Typography sx={{fontWeight:"bold", fontSize:"1.2rem"}}>{type}</Typography>
                                <Chip label={ingredientDTOs?.reduce((acc, ingredientDTO) => { return acc + ingredientDTO.ingredient.calories * ingredientDTO.quantity }, 0)
                                    + " calories"}/>

                            </Stack>
                            <Stack direction={"row"} spacing={2}>
                                <Box>
                                    <CardMedia
                                        sx={{ width:"100px", height: "100px",objectFit:"cover",borderRadius:1 }}
                                        component="img"
                                        image={image}
                                        alt={image}
                                    />
                                </Box>
                                <Box>
                                    <Stack>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                                        {recipeName}
                                    </Typography>
                                    <Typography variant={"body2"} sx={{ color: "text.secondary" }}>
                                        {description}
                                    </Typography>


                                    </Stack>
                                </Box>
                            </Stack>

                        </CardContent>
                    </CardActionArea>
                </Card>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{recipeName}</DialogTitle>
                    <DialogContent dividers>
                        {recipeIsLoading ? <CircularProgress></CircularProgress> :
                            <>
                                {/*<Typography variant="subtitle1" gutterBottom>*/}
                                {/*    {recipe.description}*/}
                                {/*</Typography>*/}
                                {/*<Typography variant="body2" gutterBottom>*/}
                                {/*    Instructions: {instructions}*/}
                                {/*</Typography>*/}
                                <ViewSingleRecipe id={id}></ViewSingleRecipe>
                            </>
                        }
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }


    if(!author || !breakfast || !lunch || !dinner){
        return <CircularProgress></CircularProgress>
    }
    return (
        <Card variant={"outlined"} sx={{maxWidth:360}}>
            <CardContent>
                <Typography>{author}'s meal plan</Typography>
            </CardContent>
            <RecipePreview
                type={"Breakfast"}
                id={breakfast.id}
                author={breakfast.author}
                createTimestamp={breakfast.createTimestamp}
                recipeName={breakfast.name}
                description={breakfast.description}
                image={breakfast.img_uri}
                instructions={breakfast.instructions}
            />
            <Divider></Divider>

            <RecipePreview
                type={"Lunch"}
                id={lunch.id}
                author={lunch.author}
                createTimestamp={lunch.createTimestamp}
                recipeName={lunch.name}
                description={lunch.description}
                image={lunch.img_uri}
                instructions={lunch.instructions}
            />
            <Divider></Divider>

            <RecipePreview
                type={"Dinner"}
                id={dinner.id}
                author={dinner.author}
                createTimestamp={dinner.createTimestamp}
                recipeName={dinner.name}
                description={dinner.description}
                image={dinner.img_uri}
                instructions={dinner.instructions}
            />
            <Divider></Divider>
        </Card>
    )
}
