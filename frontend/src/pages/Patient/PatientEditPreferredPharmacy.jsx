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
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";
import {API_URL} from "../../utils/constants.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {toast} from "sonner";

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
                const res = await fetch(API_URL + `/patient/${roleData.id}/pharmacy`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Failed to fetch patients\' preferred pharmacy');
                return res.json();
            },

        }
    )
    const [selectedPharmacyId, setSelectedPharmacyId] = useState(null)
    useEffect(() => {
        if (patientPreferredPharmacy?.id) {
            setSelectedPharmacyId(patientPreferredPharmacy.id)
        }
    }, [patientPreferredPharmacy]);

    const handleChange = (e) => {
        setSelectedPharmacyId(e.target.value)
    };
    const queryClient = useQueryClient()
   return (
           <Paper sx={{p:2, }}>
               <FormControl fullWidth required>
                   {isLoadingPharmacies ? (
                       <Skeleton />
                   ) : (
                       <Stack spacing={1}>
                           <Typography sx={{fontWeight:"bold",fontSize:"1.4rem"}}>Preferred pharmacy - {patientPreferredPharmacy?.name}</Typography>
                           <Select
                               value={selectedPharmacyId}
                               onChange={handleChange}
                           >
                               {pharmacies?.map((pharmacy) => (
                                   <MenuItem key={pharmacy.id} value={pharmacy.id}>
                                       {pharmacy.name} - {pharmacy.address} - {pharmacy.zipCode}
                                   </MenuItem>
                               ))}
                           </Select>
                           <Button onClick={()=>{
                               const run = async () => {
                                   try {
                                       const res = await fetch(API_URL + `/patient/${roleData.id}/pharmacy/${selectedPharmacyId}`,
                                           {
                                               method: "PUT",
                                               credentials: "include"
                                           })
                                       if (res.ok) {
                                           toast.success("Changed preferred pharmacy")
                                           queryClient.invalidateQueries(queryKeys.pharmacies.patient)
                                       }else {
                                           throw new Error()
                                       }

                                   }catch(e) {
                                       toast.error("There was an error while trying to change the preferred pharmacy.")
                                   }
                               }
                               run()


                           }} disabled={patientPreferredPharmacy.id === selectedPharmacyId} variant={"contained"}>Change preferred pharmacy</Button>
                       </Stack>
                   )}
               </FormControl>
           </Paper>
   )
}