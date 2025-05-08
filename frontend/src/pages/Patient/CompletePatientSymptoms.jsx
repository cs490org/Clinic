import PatientSymptoms from "./PatientSymptoms.jsx";
import {Container, Stack, Typography} from "@mui/material";
import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";

export default function CompletePatientSymptoms(){
    const {roleData} = useContext(UserContext)
    return (
        <Container>
            <Stack spacing={2} alignItems={"center"}>
                <Typography variant={"h4"} fontWeight={"bold"} textAlign={"center"}>Your symptoms</Typography>
                <PatientSymptoms patient_id={roleData.id}/>
            </Stack>
        </Container>
    )
}