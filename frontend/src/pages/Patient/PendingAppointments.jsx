import { Avatar, Button, Divider, Paper, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../utils/constants.js";
import { toast } from "sonner";
import MealPlansWidget from "./MealPlansWidget.jsx";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import {useNavigate} from "react-router-dom";

export default function PendingAppointments() {

    const { user, roleData } = useContext(UserContext);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function run() {
            /**
             * @description Gets the PENDING appointments for the patient,
             * status 1 = PENDING
             * status 2 = CONFIRMED
             * status 3 = CANCELLED
             */
            const res = await fetch(API_URL + `/appointments/patient?patientId=${roleData.id}&status=2`, {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setPendingAppointments(data);
            }
        }

        run();
    }, []);
    return (
        <div style={{ height: "100%", display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Paper sx={{ height: "100%", p: "1rem" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.4rem", marginBottom: '12px' }}>
                    Upcoming Appointments
                </Typography>

                {pendingAppointments.length > 0 ? (
                    <>
                        {pendingAppointments.map((appointment, index) => {
                            const appointmentDate = new Date(appointment.appointmentTimestamp);
                            const currentDate = new Date();
                            const canEnter = appointmentDate <= currentDate;

                            return (
                                <div key={appointment.id} style={{ display: 'flex', flexDirection: 'column', height: 100 }}>
                                    <div style={{ flexWrap: "wrap", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                                            <Avatar src={appointment.doctor.user.imgUri} sx={{ width: 48, height: 48 }} />
                                            <div>
                                                <Typography sx={{ fontWeight: "bold" }}>{appointment.doctor.firstName} {appointment.doctor.lastName}, MD</Typography>
                                                <Typography sx={{ fontSize: ".8rem", color: "text.secondary" }}>{appointment.doctor.specialty}</Typography>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                            <Typography>
                                                {(() => {
                                                    const date = new Date(appointment.appointmentTimestamp);
                                                    const today = new Date();
                                                    const tomorrow = new Date(today);
                                                    tomorrow.setDate(tomorrow.getDate() + 1);

                                                    let dayString = '';
                                                    if (date.toDateString() === today.toDateString()) {
                                                        dayString = 'Today';
                                                    } else if (date.toDateString() === tomorrow.toDateString()) {
                                                        dayString = 'Tomorrow';
                                                    } else {
                                                        dayString = date.toLocaleString('en-US', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        });
                                                    }

                                                    return `${dayString} at ${date.toLocaleString('en-US', {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true
                                                    })}`;
                                                })()}
                                            </Typography>
                                            <div style={{ flexWrap: "wrap", display: 'flex', flexDirection: 'row', gap: 12 }}>
                                                <Button variant="contained" color="white" onClick={() => {
                                                    axios.patch(`${API_URL}/appointments/${appointment.id}/reject`, { withCredentials: true })
                                                        .then(() => {
                                                            toast.success('Appointment cancelled successfully');
                                                            window.location.reload();
                                                        }).catch(()=>{
                                                           toast.error("Error while trying to cancel appointment.")
                                                    })
                                                }}>
                                                    Cancel
                                                </Button>
                                                <Tooltip title={!canEnter ? "Appointment not ready yet" : ""}>
                                                    <span>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            // onClick={() => navigate(`/appointment/${appointment.id}`)}
                                                            onClick={() => navigate(`/appointment/${appointment.id}/${appointment.doctor.id}`)}
                                                            disabled={!canEnter}
                                                        >
                                                            Enter
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                    {index < pendingAppointments.length - 1 && <Divider sx={{ my: 2 }} />}
                                </div>
                            );
                        })}
                    </>
                ) : <Typography>You have no pending appointments.</Typography>}

            </Paper>
        </div>
    )
}