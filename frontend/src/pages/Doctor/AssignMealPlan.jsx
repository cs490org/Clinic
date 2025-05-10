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
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../utils/constants.js";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {queryKeys} from "../../utils/queryKeys.js";

export default function AssignMealPlan() {
    const { user, roleData } = useContext(UserContext)
    const [selectedPatientId, setSelectedPatientId] = useState("");
    // const [breakfastId, setBreakfastId] = useState("");
    // const [lunchId, setLunchId] = useState("");
    // const [dinnerId, setDinnerId] = useState("");
    const [mealPlanId, setMealPlanId] = useState("");
    const navigate = useNavigate()

    const handleChange = (event) => {
        setSelectedPatientId(event.target.value);
    };


    const { data: patients, isLoading: recipesIsLoading } = useQuery({
        queryKey: ["doctors_patients"],
        queryFn: async () => {
            const res = await fetch(API_URL + `/doctor/patients?doctorId=${roleData.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch recipes');
            return res.json();
        }
    });

    const { data: mealplans, isLoading } = useQuery({
        queryKey:queryKeys.mealplans.all,
        queryFn: async () => {
            const res = await fetch(API_URL + `/mealplans`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch meal plans');
            return res.json();
        }
    });

    const submit = async () => {
        if (!selectedPatientId || !mealPlanId) {
            toast.error("All fields are required.");
            return;
        }

        const payload = {
            patientId: selectedPatientId,
            mealPlanId
        };
        console.log(payload)

        try {
            const res = await fetch(API_URL + `/mealplans/patient`, {
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

    if (patients?.length == 0) {

        return (
            <Typography>
                You currently have no assigned patients.
            </Typography>
        )
    }
    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: "2rem" }}>
                Assign meal plan
            </Typography>
            <Typography>
                Choose patient
            </Typography>
            {
                isLoading ? (
                    <CircularProgress />
                ) : (
                    <FormControl fullWidth sx={{ mt: 2 }}>
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


            <Typography sx={{ mt: 4 }}>Choose recipes</Typography>

            {recipesIsLoading ? (
                <CircularProgress />
            ) : (
                <Stack spacing={2}>
                    <FormControl fullWidth >
                        <InputLabel id="mealplan-label">Meal plan</InputLabel>
                        <Select
                            labelId="mealplan-label"
                            value={mealPlanId}
                            onChange={(e) => setMealPlanId(e.target.value)}
                        >
                            {/*lol */}
                            {mealplans?.map((mealplan) => (
                                <MenuItem key={mealplan.mealPlan.id} value={mealplan.mealPlan.id}>
                                    {mealplan.mealPlan.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <Button variant="contained" onClick={() => submit()}>Assign</Button>
                </Stack>
            )}
        </Container>




    )

}