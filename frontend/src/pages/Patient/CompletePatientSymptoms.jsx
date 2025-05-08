import PatientSymptoms from "./PatientSymptoms.jsx";
import {Container, Stack, Typography} from "@mui/material";

export default function CompletePatientSymptoms(){

    return (
        <Container>
            <Stack spacing={2} alignItems={"center"}>
                <Typography variant={"h4"} fontWeight={"bold"} textAlign={"center"}>Your symptoms</Typography>
                <PatientSymptoms/>
            </Stack>
        </Container>
    )
}