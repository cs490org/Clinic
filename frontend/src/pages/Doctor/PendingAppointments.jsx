import {Box, Button, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {API_URL} from "../../utils/constants.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";

const PendingAppointments = () => {

    // TODO: get this from usercontext
    const doctor_id = 1


    const queryClient = useQueryClient();
    const {data: appointments, isLoading, error} = useQuery({

            queryKey: queryKeys.appointments.pending(doctor_id),
            queryFn: () => fetch(`${API_URL}/appointments?doctor_id=${doctor_id}&status=PENDING`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(res => res.json())
        }
    )

    const mutation = useMutation({
            mutationFn: (id) => fetch(`${API_URL}/appointments/${id}/confirm`, {method: "PATCH", credentials: 'include'}),
            onSuccess: () => {
                //https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
                queryClient.invalidateQueries({queryKey: queryKeys.appointments.all});
            }
        }
    );

    const confirmAppointment = async (id) => {
        mutation.mutate(id)
    }

    const PendingAppointmentCard = ({appointmentId, name, time}) => {
        return (
            <Paper sx={{p: 2}}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Box>
                        <Box>
                            <Typography fontSize={"1.2rem"} fontWeight={"bold"}>{name}</Typography>
                        </Box>
                        <Box>
                            <Typography>{dayjs(time).format("MMMM D, YYYY")}</Typography>
                            <Typography>{dayjs(time).format("h:mm A")}</Typography>
                        </Box>
                    </Box>
                    <Stack spacing={.5}>
                        <Button onClick={() => {
                            confirmAppointment(appointmentId)
                        }} variant={"contained"}>Accept</Button>
                        <Button variant={"outlined"}>Reject</Button>
                    </Stack>
                </Stack>
            </Paper>
        )
    }
    return (

        <Stack direction={"row"}>
            <Paper variant="outlined" sx={{p: 2}}>
                <Typography variant="h5"> Appointment Requests</Typography>
                {
                    isLoading ?
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress/>
                        </Box>

                        :
                        error ?
                            <Paper sx={{p: 3, textAlign: 'center'}}>
                                <Typography color="error">There was an error when tring to getting
                                    appointments.</Typography>
                            </Paper>
                            :
                            appointments.length === 0
                                ?
                                <Paper sx={{p: 3}}>
                                    <Typography>You have no appointment requests.</Typography>
                                </Paper>
                                :
                                <Stack spacing={2}>
                                    {
                                        appointments.map((appointment, index) =>
                                            <PendingAppointmentCard
                                                key={index}
                                                appointmentId={appointment.id}
                                                name={`${appointment.patient.user.firstName} ${appointment.patient.user.firstName}`}
                                                time={appointment.appointmentTimestamp}
                                            />
                                        )
                                    }
                                </Stack>
                }
            </Paper>
        </Stack>
    )
}

export default PendingAppointments