import PatientEditPreferredPharmacy from "../PatientEditPreferredPharmacy.jsx";
import {CircularProgress, Container, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../../utils/queryKeys.js";
import {API_URL} from "../../../utils/constants.js";

export default function PatientPharmacy(){

    const {data: patientPreferredPharmacy, isLoading:isLoadingPatientPharmacy} = useQuery(
        {
            queryKey: queryKeys.pharmacies.patient,
            queryFn: async () => {
                const res = await fetch(API_URL + `/patient/pharmacy?patientId=${roleData.id}`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch patients\' preferred pharmacy');
                return res.json();
            },

        }
    )

    if(isLoadingPatientPharmacy){
        return <CircularProgress></CircularProgress>
    }

    return  (
        <Container>
            <Typography sx={{fontWeight:"bold", fontSize:"1.4rem", textAlign:"center"}}>{patientPreferredPharmacy.name}</Typography>
            <PatientEditPreferredPharmacy/>
        </Container>
    )
}