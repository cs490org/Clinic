import {
    CircularProgress,
    Container,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants.js";
import RecipeCard from "./RecipeCard.jsx";

export default function Recipe({id,reduced}) {
    const [loading,setLoading] = useState(true)
    const [recipe, setRecipe] = useState([])
    useEffect(() => {

        const run = async () => {
            try {
                const response = await fetch(API_URL + `/recipes?id=${id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                )
                const data = await response.json()
                setRecipe(data)
            }finally{
                setLoading(false)
            }
        }
        run()
    }, [id]);


    return (
        <>
            <Container sx={{ display: "flex", justifyContent: "Center" }}>

                <Stack spacing={2}>

                    {!loading ?
                        <RecipeCard
                            id={recipe.id}
                            author={recipe.author}
                            createTimestamp={recipe.createTimestamp}
                            recipeName={recipe.name}
                            description={recipe.description}
                            image={recipe.img_uri}
                            instructions={recipe.instructions}
                            reduced={reduced}
                        />
                        :
                        <CircularProgress/>
                    }
                </Stack>
            </Container>
        </>
    )

}
