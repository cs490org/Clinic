import {Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {useContext, useState} from "react";
import {API_URL} from "../../utils/constants.js";
import {UserContext} from "../../contexts/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export default function RecipeCreate(){
    const {user} = useContext(UserContext)
    const [recipeName,setRecipeName] = useState("")
    const [recipeDescription,setRecipeDescription] = useState("")

    const navigate = useNavigate();

    const create = async () => {

        try{
            const response = await fetch(API_URL + "/recipes",
                {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        name: recipeName,
                        description: recipeDescription
                    }),
                    credentials:"include" // send access and refresh token in set cookies header
                })
            if(response.status === 200){

                navigate(-1)
                toast.success("Created recipe!")
            }
        } catch(e){
            console.log(e)
        }
    }
    return (
        <Container>
            <Paper sx={{p:2}}>
                <Stack spacing={2}>
                    <Typography sx={{fontSize:"1.2rem"}}>Create recipe</Typography>
                    <TextField onChange={(e)=>setRecipeName(e.target.value)} label={"Enter recipe name..."}/>
                    <TextField onChange={(e)=>setRecipeDescription(e.target.value)} multiline rows={4} maxRows={8} label={"Enter description..."}/>
                    <Button onClick={()=>create()} variant={"contained"}>Create</Button>
                </Stack>
            </Paper>
        </Container>
    )

}