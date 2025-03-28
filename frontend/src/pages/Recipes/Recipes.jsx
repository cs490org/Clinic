import {
    Button,
    Container, Select,
    Stack, TextField,
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
            setRecipes(data)
        }
        run()
    }, []);



    const mockData = [{
        author: "Doctor Dump Ling",
        subheader: "March 30, 2025",
        image: "/src/assets/garlic_chicken.jpg",
        recipeName: "Honey Garlic Chicken",
        description: "Delicious honey garlic chicken with lower calories",
    }]
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
                                author={recipe.author}
                                createTimestamp={recipe.createTimestamp}
                                recipeName={recipe.name}
                                description={recipe.description}
                                image={"/src/assets/garlic_chicken.jpg"}

                            />

                        })
                    }
                </Stack>
            </Container>
        </>
    )

}