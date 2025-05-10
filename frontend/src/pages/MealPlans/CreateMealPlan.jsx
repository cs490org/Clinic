import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";
import {useContext, useState} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {API_URL} from "../../utils/constants.js";
import {toast} from "sonner";
import FoodNav from "../FoodNav.jsx";

export default function CreateMealPlan(){

    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [breakfastId, setBreakfastId] = useState("");
    const [lunchId, setLunchId] = useState("");
    const [dinnerId, setDinnerId] = useState("");
    const navigate = useNavigate()

    const { data: recipes, isLoading:recipesIsLoading } = useQuery({
        queryKey: ["recipes"],
        queryFn: async () => {
            const res = await fetch(API_URL + `/recipes`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch patients');
            return res.json();
        }
    });

    const submit = async () => {
        if (!selectedPatientId || !breakfastId || !lunchId || !dinnerId) {
            toast.error("All fields are required.");
            return;
        }

        const payload = {
            patientId: selectedPatientId,
            breakfastId,
            lunchId,
            dinnerId
        };
        console.log(payload)

        try {
            const res = await fetch(API_URL + `/mealplans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error("Failed to create meal plan");
            }

            toast.success("Meal plan assigned successfully!");
            navigate(-1)


        } catch (err) {
            toast.error(err.message);
        }
    };


    return (
        <>
        <FoodNav />
        <Container>
            <Typography sx={{fontWeight:"bold",fontSize:"1.4rem"}}>Create a meal plan</Typography>

            <Typography sx={{ mt: 4 }}>Choose recipes</Typography>

            {recipesIsLoading ? (
                <CircularProgress />
            ) : (
                <Stack spacing={2}>
                    <FormControl fullWidth >
                        <InputLabel id="breakfast-select-label">Breakfast</InputLabel>
                        <Select
                            labelId="breakfast-select-label"
                            value={breakfastId}
                            onChange={(e) => setBreakfastId(e.target.value)}
                        >
                            {recipes?.map((recipe) => (
                                <MenuItem key={recipe.id} value={recipe.id}>
                                    {recipe.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth >
                        <InputLabel id="lunch-select-label">Lunch</InputLabel>
                        <Select
                            labelId="lunch-select-label"
                            value={lunchId}
                            onChange={(e) => setLunchId(e.target.value)}
                        >
                            {recipes?.map((recipe) => (
                                <MenuItem key={recipe.id} value={recipe.id}>
                                    {recipe.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth >
                        <InputLabel id="dinner-select-label">Dinner</InputLabel>
                        <Select
                            labelId="dinner-select-label"
                            value={dinnerId}
                            onChange={(e) => setDinnerId(e.target.value)}
                        >
                            {recipes?.map((recipe) => (
                                <MenuItem key={recipe.id} value={recipe.id}>
                                    {recipe.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={() => submit()}>Create</Button>
                </Stack>
            )}
        </Container>
            </>




    )
}