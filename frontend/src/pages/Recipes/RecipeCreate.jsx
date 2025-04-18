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
import { API_URL } from "../../utils/constants.js";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";
import DeleteIcon from '@mui/icons-material/Delete';
import Dropzone from "react-dropzone";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function RecipeCreate() {
    const { user } = useContext(UserContext)
    const [recipeName, setRecipeName] = useState("")
    const [recipeImage,setRecipeImage] = useState("")
    const [recipeDescription, setRecipeDescription] = useState("")
    const [recipeInstructions,setRecipeInstructions] = useState("")
    

    const navigate = useNavigate();

    // array of objects, fields are ingredientId, and quantity.
    const [ingredientDTOs, setIngredientDTOs] = useState([])

    const {data:ingredients,isLoading} = useQuery({
        queryKey:queryKeys.ingredients.all,
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

    const totals = ingredientDTOs.reduce((acc,dto)=>{
            const ingredient = ingredients?.find(i=>i.id == dto.ingredientId)

            // we might encounter ""
            if(!ingredient) return acc;

            const quantity = dto.quantity
            acc.fats += ingredient.fats * quantity;
            acc.carbs += ingredient.carbs * quantity;
            acc.protein += ingredient.protein * quantity;
            acc.calories += ingredient.calories * quantity;
            return acc;
        },
        {fats:0,carbs:0,protein:0,calories:0}
    )

    const create = async () => {
        const cleanedIngredientDTOs = ingredientDTOs.filter(ingredientDTO => ingredientDTO.ingredientId!== "")
        if (!recipeName.trim()) {
            toast.error("Recipe name is required");
            return;
        }
        if (!recipeImage){
            toast.error("Recipe image is required")
            return;
        }
        if (!recipeInstructions.trim()) {
            toast.error("Instructions are required");
            return;
        }
        if (cleanedIngredientDTOs.length === 0) {
            toast.error("At least one ingredient must be selected");
            return;
        }
        try {
            const formData = new FormData()
            formData.append("userId",user.id);
            formData.append("name",recipeName);
            formData.append("description",recipeDescription);
            cleanedIngredientDTOs.forEach((ingredientDTO, index) => {
                formData.append(`ingredientRequestDTOS[${index}].ingredientId`, ingredientDTO.ingredientId);
                formData.append(`ingredientRequestDTOS[${index}].quantity`, ingredientDTO.quantity);
            });
            formData.append("instructions",recipeInstructions);
            formData.append("image",recipeImage);
            console.log("recipe image: ",recipeImage)
            const response = await fetch(API_URL + "/recipes",
                {
                    method: "POST",
                    body:formData,
                    credentials: "include"
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
        <Box sx={{display:"flex", justifyContent:"center",alignItems:"center"}}>
            <Container >
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography sx={{textAlign:"center", fontSize: "1.6rem",fontWeight:"bold" }}>Create new recipe</Typography>
                        <Divider></Divider>
                        <TextField onChange={(e) => setRecipeName(e.target.value)} label={"Recipe name"} required/>
                        <TextField onChange={(e) => setRecipeDescription(e.target.value)} multiline rows={2} maxRows={4} label={"Description"} />


                        <Divider></Divider>
                        <Accordion>
                            <AccordionSummary>
                                <Typography sx={{fontSize:"1.6rem", fontWeight:"bold"}}>1. Add Image</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Dropzone onDrop={(acceptedFiles)=>{
                                    const image = acceptedFiles[0]
                                    acceptedFiles[0].preview = URL.createObjectURL(acceptedFiles[0])
                                    setRecipeImage(image)

                                }}>
                                    {({getRootProps, getInputProps}) =>(
                                        <Box {...getRootProps({border:"solid 2px",borderColor:"primary.main",p:".7rem" })}>
                                            <Box sx={{cursor:"pointer",p:"2rem",border:"dotted 2px"}}>
                                                {
                                                    recipeImage &&
                                                <Box
                                                    component={"img"}
                                                    width={"100%"}
                                                    alt={"Recipe image preview."}
                                                    src={recipeImage.preview}
                                                />
                                                }
                                               <input {...getInputProps()}/>
                                                {
                                                    !recipeImage ?
                                                <Typography>Select recipe image</Typography>
                                                        :
                                                <Typography>{recipeImage.path}</Typography>
                                                }
                                            </Box>
                                        </Box>
                                    )}
                                </Dropzone>
                            </AccordionDetails>
                        </Accordion>
                        <Divider></Divider>

                        <Accordion>
                            <AccordionSummary>
                                <Typography sx={{fontSize:"1.6rem", fontWeight:"bold"}}>2. Add Ingredients</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Stack gap={"4rem"} direction={"row"} flexWrap={"wrap"}>
                                    <Box sx={{minWidth:"300px"}} flex={"2"}>
                                        {ingredientDTOs.map((ingredientDTO, index) => (
                                            <Stack key={index} flexWrap={"wrap"} direction={"row"} spacing={2} justifyContent={"center"}>
                                                <Select
                                                    sx={{flex:"1"}}
                                                    key={index}
                                                    value={ingredientDTO.ingredientId}
                                                    onChange={(e) => {
                                                        const newIngredientDTOs = [...ingredientDTOs];
                                                        newIngredientDTOs[index]= {ingredientId: e.target.value, quantity: 1};

                                                        // Add a new empty select only if this is the last one and it's now filled
                                                        if (index === ingredientDTOs.length - 1 && e.target.value !== "") {
                                                            newIngredientDTOs.push({ingredientId:""});
                                                        }

                                                        setIngredientDTOs(newIngredientDTOs);
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

                                                {
                                                    ingredientDTO.quantity &&
                                                    <Stack direction={"row"} alignItems={"center"}>
                                                        <IconButton onClick={()=>{
                                                            const newIngredientDTOs = [...ingredientDTOs]
                                                            const newQty = Math.max(1,ingredientDTO.quantity-1)
                                                            newIngredientDTOs[index] = {...ingredientDTO,quantity:newQty};
                                                            setIngredientDTOs(newIngredientDTOs);
                                                        }}>
                                                            <RemoveIcon/>
                                                        </IconButton>
                                                        <Typography>
                                                            {ingredientDTO.quantity}
                                                        </Typography>
                                                        <IconButton onClick={()=>{
                                                            const newIngredientDTOs = [...ingredientDTOs]
                                                            newIngredientDTOs[index] = {...ingredientDTO,quantity:ingredientDTO.quantity+1};
                                                            setIngredientDTOs(newIngredientDTOs);
                                                        }}>
                                                            <AddIcon/>
                                                        </IconButton>
                                                    </Stack>
                                                }
                                                {ingredientDTOs.length > 1 && ingredientDTO.ingredientId!=="" && (
                                                    <IconButton
                                                        onClick={() => {
                                                        const newIds = [...ingredientDTOs];
                                                        newIds.splice(index, 1);
                                                        setIngredientDTOs(newIds);
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                                {/* Initialize with one empty select */}
                                            </Stack>
                                        ))}
                                        {ingredientDTOs.length === 0 && setIngredientDTOs([{ingredientId:""}])}
                                    </Box>

                                    {/* Recipe summary here*/}
                                    <Box minWidth={"200px"} flex={"1"}>
                                        <Typography sx={{fontWeight:"bold"}}>Recipe Summary:</Typography>
                                        <Divider/>
                                        <Typography>Fats: {totals.fats}g</Typography>
                                        <Typography>Carbs: {totals.carbs}g</Typography>
                                        <Typography>Protein: {totals.protein}g</Typography>
                                        <Divider/>
                                        <Typography>Calories: {totals.calories}</Typography>
                                    </Box>
                                </Stack>

                            </AccordionDetails>
                        </Accordion>


                        <Divider></Divider>

                        <Accordion>
                            <AccordionSummary>
                                <Typography sx={{fontSize:"1.6rem", fontWeight:"bold"}}>3. Add Instructions</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField fullWidth onChange={(e) => setRecipeInstructions(e.target.value)} multiline rows={4} maxRows={16} label={"Enter instructions..."} />
                            </AccordionDetails>
                        </Accordion>
                        <Button onClick={() => create()} variant={"contained"}>Create Recipe</Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    )

}