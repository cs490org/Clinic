import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState, useContext } from "react";
import { API_URL } from "../../../utils/constants.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../utils/queryKeys.js";
import { UserContext } from "../../../contexts/UserContext.jsx";
import { toast } from "sonner";

const PendingAppointments = () => {
    const { user } = useContext(UserContext);

    const queryClient = useQueryClient();
    const { data: appointments, isLoading, error } = useQuery({
        queryKey: queryKeys.appointments.pending(user.id),
        queryFn: () => fetch(`${API_URL}/appointments?doctor_id=${user.id}&status=PENDING`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => res.json())
    });

    const mutation = useMutation({
        mutationFn: (id) => fetch(`${API_URL}/appointments/${id}/confirm`, { method: "PATCH", credentials: 'include' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (id) => fetch(`${API_URL}/appointments/${id}/reject`, { method: "PATCH", credentials: 'include' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
        }
    });

    const confirmAppointment = async (id) => {
        mutation.mutate(id);
    };

    const rejectAppointment = async (id) => {
        rejectMutation.mutate(id);
    };

    const PendingAppointmentCard = ({ appointmentId, name, time }) => {
        return (
            <Paper sx={{ p: 2 }}>
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
                            confirmAppointment(appointmentId);
                            toast.success("Confirmed appointment!");
                        }} variant={"contained"}>Accept</Button>
                        <Button onClick={() => {
                            rejectAppointment(appointmentId);
                            toast.success("Rejected appointment!");
                        }} variant={"outlined"} color="error">Reject</Button>
                    </Stack>
                </Stack>
            </Paper>
        );
    };

    return (
        <Stack direction={"row"}>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h5">Appointment Requests</Typography>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="error">There was an error when trying to get appointments.</Typography>
                    </Paper>
                ) : appointments.length === 0 ? (
                    <Paper sx={{ p: 3 }}>
                        <Typography>You have no appointment requests.</Typography>
                    </Paper>
                ) : (
                    <Stack spacing={2}>
                        {appointments.map((appointment, index) => (
                            <PendingAppointmentCard
                                key={index}
                                appointmentId={appointment.id}
                                name={`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                                time={appointment.appointmentTimestamp}
                            />
                        ))}
                    </Stack>
                )}
            </Paper>
        </Stack>
    );
};

export default PendingAppointments;