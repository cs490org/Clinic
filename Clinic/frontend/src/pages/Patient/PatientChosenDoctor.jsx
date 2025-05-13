import {Avatar, Box, Button, CircularProgress, Paper, Typography} from "@mui/material";
import axios from "axios";
import {API_URL} from "../../utils/constants.js";
import {toast} from "sonner";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";

export default function PatientChosenDoctor(){

    const {user,roleData} = useContext(UserContext)

    const { data: chosenDoctor, isLoading: chosenDoctorIsLoading } = useQuery({
        queryKey: ["chosen_doctor"],
        queryFn: async () => {
            const res = await fetch(API_URL + `/patient/doctor?userId=${user.id}`, {
                credentials: 'include'
            });
            if (res.status === 404) {
                return null
            }
            if (!res.ok) throw new Error('Failed to fetch pharmacies');
            return res.json();
        }
    });


    const queryClient = useQueryClient()

    return (

        <Paper sx={{ height: "100%", p: "1rem" }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                Chosen doctor
            </Typography>


            {
                chosenDoctorIsLoading ? <CircularProgress/> :
                chosenDoctor ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Avatar
                            src={chosenDoctor.doctor.user.imgUri}
                            alt={`${chosenDoctor.doctor.firstName} ${chosenDoctor.doctor.lastName}`}
                            sx={{ width: 64, height: 64 }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Dr. {chosenDoctor.doctor.firstName} {chosenDoctor.doctor.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {chosenDoctor.doctor.specialty}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {
                                    if(window.confirm("Are you sure you want to fire your current doctor?")) {
                                        axios.delete(`${API_URL}/patient/doctor?patientId=${roleData.id}`, {withCredentials: true})
                                            .then(() => {
                                                toast.success('Doctor removed successfully');
                                                // invalidate query from key, so we dont have to reload page, react query will fetch the data again.
                                                queryClient.invalidateQueries(["chosen_doctor"])
                                                // window.location.reload();
                                            })
                                            .catch(() => {
                                                toast.error('Failed to remove doctor');
                                            });
                                    }
                                }}
                                sx={{ mt: 1 }}
                            >
                                Fire Doctor
                            </Button>
                        </Box>
                    </Box>
                )
                :
                (
                    <Typography>
                        You currently do not have a chosen doctor.<br></br>To choose one, make an appointment.
                    </Typography>
                )
            }
        </Paper>
    )
}