import {
    Button,
    Container,
    Divider,  IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useContext, useState } from "react";
import { API_URL } from "../../utils/constants.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";
import DeleteIcon from '@mui/icons-material/Delete';

export default function RecipeCreate() {
    const { user } = useContext(UserContext)
    const [recipeName, setRecipeName] = useState("")
    const [recipeDescription, setRecipeDescription] = useState("")
    const [recipeInstructions,setRecipeInstructions] = useState("")

    const navigate = useNavigate();

    const [ingredientIds, setIngredientIds] = useState([])

    const {data:ingredients,isLoading} = useQuery({
        queryKey:queryKeys.ingredients,
        queryFn: async () => {
            const response = await fetch(API_URL+"/ingredients",
                {
                    method:"GET",
                    credentials:"include"
                })

            const data = await response.json()
            return data
        }
    })

    const create = async () => {
        const cleanedIngredientIds = ingredientIds.filter(id => id !== "").map(Number);
        if (!recipeName.trim()) {
            toast.error("Recipe name is required");
            return;
        }

        if (!recipeInstructions.trim()) {
            toast.error("Instructions are required");
            return;
        }

        if (cleanedIngredientIds.length === 0) {
            toast.error("At least one ingredient must be selected");
            return;
        }
        try {
            const response = await fetch(API_URL + "/recipes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        name: recipeName,
                        description: recipeDescription,
                        ingredientIds:cleanedIngredientIds,
                        instructions:recipeInstructions
                    }),
                    credentials: "include" // send access and refresh token in set cookies header
                })
            if (response.status === 200) {

                navigate(-1)
                toast.success("Created recipe!")
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Container>
            <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Typography sx={{ fontSize: "1.2rem",fontWeight:"bold" }}>Create recipe</Typography>
                    <TextField onChange={(e) => setRecipeName(e.target.value)} label={"Recipe name"} required/>
                    <TextField onChange={(e) => setRecipeDescription(e.target.value)} multiline rows={2} maxRows={4} label={"Description"} />
                    <Divider></Divider>

                    <Typography sx={{fontSize:"1.2rem", fontWeight:"bold"}}>Ingredients</Typography>

                    {ingredientIds.map((ingredientId, index) => (
                        <Stack direction={"row"} spacing={2}>
                                <Select
                                    sx={{flex:1}}
                                    key={index}
                                    value={ingredientId}
                                    onChange={(e) => {
                                        const newIds = [...ingredientIds];
                                        newIds[index] = e.target.value;

                                        // Add a new empty select only if this is the last one and it's now filled
                                        if (index === ingredientIds.length - 1 && e.target.value !== "") {
                                            newIds.push("");
                                        }

                                        setIngredientIds(newIds);
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value={""} disabled>Select an ingredient...</MenuItem>
                                    {ingredients?.map((ingredient) => (
                                        <MenuItem key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {ingredientIds.length > 1 && ingredientId!=="" && (
                                    <IconButton
                                        onClick={() => {
                                        const newIds = [...ingredientIds];
                                        newIds.splice(index, 1);
                                        setIngredientIds(newIds);
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                        </Stack>
                    ))}

                    {/* Initialize with one empty select */}
                    {ingredientIds.length === 0 && setIngredientIds([""])}




                    <Divider></Divider>
                    <Typography sx={{fontSize:"1.2rem", fontWeight:"bold"}}>Instructions</Typography>
                    <TextField onChange={(e) => setRecipeInstructions(e.target.value)} multiline rows={4} maxRows={16} label={"Enter instructions..."} />
                    <Button onClick={() => create()} variant={"contained"}>Create Recipe</Button>
                </Stack>
            </Paper>
        </Container>
    )

}