import {
    Container,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants.js";
import RecipeCard from "./RecipeCard.jsx";
import RecipeNav from "./RecipeNav.jsx";

export default function Recipes() {

    const [recipes, setRecipes] = useState([])
    useEffect(() => {
        const run = async () => {
            const response = await fetch(API_URL + "/recipes",
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            const data = await response.json()
            const sortedData = data.sort((a, b) =>
                new Date(b.createTimestamp) - new Date(a.createTimestamp)
            );
            setRecipes(sortedData)
        }
        run()
    }, []);


    return (
        <>
            <RecipeNav />
            <Container sx={{ display: "flex", justifyContent: "Center" }}>

                <Stack spacing={2}>
                    {recipes.length === 0 &&
                        <Typography>No recipes found.</Typography>
                    }

                    {recipes.length > 0 &&
                        recipes.map((recipe, i) => {
                            return <RecipeCard
                                key={i}
                                id={recipe.id}
                                author={recipe.author}
                                createTimestamp={recipe.createTimestamp}
                                recipeName={recipe.name}
                                description={recipe.description}
                                image={recipe.img_uri}
                                instructions={recipe.instructions}
                            />

                        })
                    }
                </Stack>
            </Container>
        </>
    )

}