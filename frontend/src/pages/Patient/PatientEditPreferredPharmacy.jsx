import {
    Button,
    CircularProgress, Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Stack, Typography
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";
import {API_URL} from "../../utils/constants.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";

export default function PatientEditPreferredPharmacy(){
    const {roleData} = useContext(UserContext)
    const { data: pharmacies, isLoading: isLoadingPharmacies } = useQuery({
        queryKey: queryKeys.pharmacies.all,
        queryFn: async () => {
            const res = await fetch(API_URL + '/pharmacies', {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch pharmacies');
            return res.json();
        },
    });

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
    const [selectedPharmacyId, setSelectedPharmacyId] = useState(patientPreferredPharmacy?.id)
    useEffect(() => {
        if (patientPreferredPharmacy?.id) {
            setSelectedPharmacyId(patientPreferredPharmacy.id)
        }
    }, [patientPreferredPharmacy]);

    const handleChange = (e) => {
        setSelectedPharmacyId(e.target.value)
    };
   return (
           <Paper sx={{p:2, }}>
               <FormControl fullWidth required>
                   <InputLabel>Preferred Pharmacy</InputLabel>
                   {isLoadingPharmacies ? (
                       <Skeleton />
                   ) : (
                       <Stack spacing={1}>
                           <Select
                               name="pharmacyId"
                               value={selectedPharmacyId}
                               onChange={handleChange}
                               label="Preferred Pharmacy"
                           >
                               {pharmacies?.map((pharmacy) => (
                                   <MenuItem key={pharmacy.id} value={pharmacy.id}>
                                       {pharmacy.name} - {pharmacy.address} - {pharmacy.zipCode}
                                   </MenuItem>
                               ))}
                           </Select>
                           <Button disabled={patientPreferredPharmacy.id === selectedPharmacyId} variant={"contained"}>Change preferred pharmacy</Button>
                       </Stack>
                   )}
               </FormControl>
           </Paper>
   )
}