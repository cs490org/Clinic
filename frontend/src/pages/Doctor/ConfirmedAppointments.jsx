import {Box, Button, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {API_URL} from "../../utils/constants.js";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";

const ConfirmedAppointments = () => {
    // TODO: get this from usercontext
    const doctor_id = 1

    const queryClient = useQueryClient();
    const {data: appointments, isLoading, error} = useQuery({

            queryKey: queryKeys.appointments.confirmed(doctor_id),
            queryFn: () => fetch(`${API_URL}/appointments?doctor_id=${doctor_id}&status=CONFIRMED`,
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

    const ConfirmedAppointmentCard = ({name, time}) => {
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
                </Stack>
            </Paper>
        )
    }
    return (

        <Stack direction={"row"}>
            <Paper variant="outlined" sx={{p: 2}}>
                <Typography variant="h5"> Confirmed Appointments</Typography>
                {isLoading ?
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress/>
                    </Box>
                    :
                    error ?
                        <Paper sx={{p: 3, textAlign: "center"}}>
                            <Typography color="error">{error}</Typography>
                        </Paper>
                        :
                        appointments.length === 0 ?
                            <Paper sx={{p: 3}}>
                                <Typography>You have no confirmed appointments</Typography>
                            </Paper>
                            :
                            <Stack spacing={2}>
                                {
                                    appointments.map((appointment, index) =>
                                        <ConfirmedAppointmentCard
                                            key={index}
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

export default ConfirmedAppointments