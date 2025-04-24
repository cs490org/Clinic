import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {API_URL} from "../../utils/constants.js";
import {useContext, useState} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {toast} from "sonner";

export default function AssignMealPlan() {
    const {user,roleData} = useContext(UserContext)
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [breakfastId, setBreakfastId] = useState("");
    const [lunchId, setLunchId] = useState("");
    const [dinnerId, setDinnerId] = useState("");


    const handleChange = (event) => {
        setSelectedPatientId(event.target.value);
    };


    const {data:patients, isLoading :recipesIsLoading} = useQuery({
        queryKey: ["doctors_patients"],
        queryFn: async () => {
            const res = await fetch(API_URL + `/doctor/patients?doctorId=${roleData.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch recipes');
            return res.json();
        }
    });

    const {data:recipes, isLoading } = useQuery({
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

        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <Container>
        <Typography sx={{fontWeight:"bold"}}>
            Assign meal plan
        </Typography>
        <Typography>
            Choose patient
        </Typography>
            {patients?.length==0 ?
                <Typography>
                    You currently have no assigned patients.
                </Typography>
                :
                isLoading ? (
                    <CircularProgress />
                ) : (
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel id="patient-select-label">Patient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            value={selectedPatientId}
                            onChange={handleChange}
                        >
                            {patients?.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    {patient.firstName} {patient.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }


            <Typography sx={{mt: 4}}>Choose recipes</Typography>

            {recipesIsLoading? (
                <CircularProgress />
            ) : (
                <>
                    <FormControl fullWidth sx={{mt: 2}}>
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

                    <FormControl fullWidth sx={{mt: 2}}>
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

                    <FormControl fullWidth sx={{mt: 2}}>
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

                    <Button onClick={()=>submit()}>Assign</Button>
                </>
            )}
            </Container>




    )

}