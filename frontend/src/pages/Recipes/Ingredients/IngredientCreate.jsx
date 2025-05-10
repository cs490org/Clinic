import {
    Button,
    Container,
    Divider, IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
    Box, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import { useContext, useState } from "react";
import {UserContext} from "../../../contexts/UserContext.jsx";
import {API_URL} from "../../../utils/constants.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FoodNav from "../../FoodNav.jsx";

export default function IngredientCreate() {
    const { user } = useContext(UserContext)
    const [ingredientName, setIngredientName] = useState("")
    const [ingredientDescription, setIngredientDescription] = useState("")

    const [ingredientFats, setIngredientFats] = useState("")
    const [ingredientCarbs, setIngredientCarbs] = useState("")
    const [ingredientProtein, setIngredientProtein] = useState("")

    const [ingredientCalories, setIngredientCalories] = useState("")

    const navigate = useNavigate();




    const create = async () => {
        if (!ingredientName.trim()) {
            toast.error("Ingredient name is required");
            return;
        }
        if (!ingredientDescription.trim()) {
            toast.error("Ingredient description is required");
            return;
        }
        if (!ingredientFats.trim()) {
            toast.error("Ingredient fats is required");
            return;
        }
        if (!ingredientCarbs.trim()) {
            toast.error("Ingredient carbs is required");
            return;
        }
        if (!ingredientProtein.trim()) {
            toast.error("Ingredient protein is required");
            return;
        }
        try {
            const response = await fetch(API_URL + "/ingredients",
                {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(
                        {
                            name:ingredientName,
                            description:ingredientDescription,
                            calories:ingredientCalories,
                            fats:ingredientFats,
                            carbs:ingredientCarbs,
                            protein:ingredientProtein,

                        }
                    ),
                    credentials: "include"
                })
            if (response.status === 200) {

                navigate(-1)
                toast.success("Created ingredient!")
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <FoodNav></FoodNav>
        <Box sx={{display:"flex", justifyContent:"center",alignItems:"center"}}>
            <Container >
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography sx={{textAlign:"center", fontSize: "1.6rem",fontWeight:"bold" }}>Create new ingredient</Typography>
                        <Divider></Divider>
                        <TextField onChange={(e) => setIngredientName(e.target.value)} label={"Ingredient name"} />
                        <TextField onChange={(e) => setIngredientDescription(e.target.value)} label={"Description"} />
                        <TextField type="number" onChange={(e) => setIngredientFats(e.target.value)} label={"Fats"} />
                        <TextField type="number" onChange={(e) => setIngredientCarbs(e.target.value)} label={"Carbs"} />
                        <TextField type="number" onChange={(e) => setIngredientProtein(e.target.value)} label={"Protein"} />
                        <TextField type="number" onChange={(e) => setIngredientCalories(e.target.value)} label={"Calories"} />

                        <Button onClick={() => create()} variant={"contained"}>Create Recipe</Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
            </>
    )

}
