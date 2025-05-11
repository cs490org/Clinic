import { Avatar, Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState, useContext } from "react";
import { API_URL } from "../../../utils/constants.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../utils/queryKeys.js";
import { UserContext } from "../../../contexts/UserContext.jsx";
import { toast } from "sonner";

const PendingAppointments = () => {
    const { user, roleData } = useContext(UserContext);

    const queryClient = useQueryClient();
    const { data: appointments, isLoading, error } = useQuery({
        queryKey: queryKeys.appointments.pending(roleData.id),
        queryFn: () => fetch(`${API_URL}/appointments?doctor_id=${roleData.id}&status=PENDING`,
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

    const PendingAppointmentCard = ({ appointmentId, name, time, symptoms }) => {
        return (
            <Paper sx={{ p: 2 }}>
                <Stack>
                    <Stack spacing={1}>
                        <Stack direction={"row"} gap={2}>
                            <Avatar />
                            <Typography fontSize={"1.4rem"} fontWeight={"medium"}>{name}</Typography>
                        </Stack>

                        <Divider />
                        <Box>
                            <Stack direction={"row"} flexWrap={"wrap"} justifyContent={"space-between"}>
                                <Typography>{dayjs(time).format("MMMM D, YYYY")}</Typography>
                                <Typography>{dayjs(time).format("h:mm A")}</Typography>
                            </Stack>
                            {symptoms && (
                                <>
                                    <Box mt={1}>
                                        <Typography color="text.secondary" fontSize={"1rem"}>
                                            <strong>Reason for visit:</strong>
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={"0.9rem"}>
                                            {symptoms}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Stack>
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
        <Paper variant="outlined" sx={{ p: 2, flex: 2 }}>
            <Typography variant="h5" fontWeight={"bold"}>Appointment Requests</Typography>
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
                    {console.log(appointments)}
                    {
                        appointments.map((appointment, index) => (

                            <PendingAppointmentCard
                                key={index}
                                appointmentId={appointment.id}
                                name={`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                                time={appointment.appointmentTimestamp}
                                symptoms={appointment.symptoms}
                            />
                        ))}
                </Stack>
            )}
        </Paper>
    );
};

export default PendingAppointments;