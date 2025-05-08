import {Box, Button, Checkbox, Divider, Paper, Stack, Typography} from "@mui/material";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";
import {API_URL} from "../../utils/constants.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

export default function PatientSymptoms(){
    const { user,roleData } = useContext(UserContext);
    const {data:symptoms, isLoading: isLoadingSymptoms} = useQuery({
        queryKey: queryKeys.symptoms.all,
        queryFn: async () => {
            const res = await fetch(API_URL + `/symptoms`, {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error('Failed to fetch all symptoms');
            return res.json();
        }
    })
    const {data:symptom_types, isLoading: isLoadingSymptomTypes} = useQuery({
        queryKey: queryKeys.symptoms.types,
        queryFn: async () => {
            const res = await fetch(API_URL + `/symptomTypes`, {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error('Failed to fetch symptom types');
            return res.json();
        }
    })
    const {data:patient_symptoms, isLoading: isLoadingPatientSymptoms} = useQuery({
        queryKey: queryKeys.symptoms.patient,
        queryFn: async () => {
            const res = await fetch(API_URL + `/patient/${roleData.id}/symptoms`, {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error('Failed to fetch patient symptoms');
            return res.json();
        }
    })

    const [payload,setPayload] = useState([])
    useEffect(() => {
        if (patient_symptoms) {
            setPayload(patient_symptoms.map(sym => ({
                patientId: roleData.id,
                symptomId: sym.symptom.id
            })));
        }
    }, [patient_symptoms]);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const onSubmit = async () =>{
        try{
            const res = await fetch(API_URL+`/patient/${roleData.id}/symptoms`,
                {
                    method:"PUT",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(
                        payload
                    )
                }
                )
            if (res.ok){
                queryClient.invalidateQueries(queryKeys.symptoms.all)
                queryClient.invalidateQueries(queryKeys.symptoms.patient)

                navigate("/patient/dashboard")
                toast.success("Updated patient symptoms!")

            }else{
                toast.error(res.status + " error when submitting patient symptoms.")
            }
        } catch(e){
            toast.error("Error when submitting patient symptoms.")
        }

    }

    return (
        <>
            {
                symptoms && symptom_types && (
                    <>
                        <Paper sx={{width:"100%", p:"1rem",maxWidth:"600px"}}>
                            <Stack spacing={3}>
                            {symptom_types.map((symptomType,index)=>{
                                return (
                                    <Box key={index}>
                                        <Typography fontWeight={"bold"} fontSize={"1.4rem"}>{symptomType}</Typography>
                                        <Divider/>
                                        {symptoms.map((symptom,index)=>{
                                            if(symptomType === symptom.symptomType){
                                                return (
                                                    <Stack key={index} justifyContent={"space-between"} direction={"row"} alignItems={"center"}>
                                                        <Typography>{symptom.name}</Typography>
                                                        <Checkbox
                                                            checked={payload.some(entry => entry.symptomId === symptom.id)}
                                                            onChange={(e)=>{
                                                            const newEntry = {
                                                                patientId: roleData.id,
                                                                symptomId: symptom.id
                                                            }
                                                            setPayload((prev)=>
                                                                {
                                                                    return e.target.checked
                                                                        ?[...prev,newEntry]
                                                                        : prev.filter((entry)=>entry.symptomId !== symptom.id)
                                                                }
                                                            )
                                                        }}></Checkbox>
                                                    </Stack>)
                                            }
                                        })}
                                    </Box>)
                            })}
                            </Stack>
                            <Button onClick={()=>onSubmit()} sx={{mt:"1rem"}}fullWidth size={"large"} variant={"contained"}>Update symptoms</Button>
                        </Paper>
                    </>
                )
            }
            </>
    )
}