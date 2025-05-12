import {Container, Divider, Typography} from "@mui/material";
import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import AllPatientMetrics from "./AllPatientMetrics.jsx";

export default function PatientMetrics(){
    const {roleData } = useContext(UserContext)
    return (

        <Container>
            <Typography sx={{fontWeight:"bold",fontSize:"1.4rem"}}> Your metrics </Typography>
            <Divider sx={{mb:"2rem"}}></Divider>
            <AllPatientMetrics patientId={roleData.id}></AllPatientMetrics>
        </Container>
    )
}