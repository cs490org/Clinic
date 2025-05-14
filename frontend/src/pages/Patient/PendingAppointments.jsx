import {
    Avatar, Button, Divider, Paper, Stack, Typography, Tooltip
  } from "@mui/material";
  import axios from "axios";
  import { API_URL } from "../../utils/constants.js";
  import { toast } from "sonner";
  import { useContext } from "react";
  import { UserContext } from "../../contexts/UserContext.jsx";
  import { useNavigate } from "react-router-dom";
  import {useQuery, useQueryClient} from "@tanstack/react-query";
  import { queryKeys } from "../../utils/queryKeys.js";
  
  export default function PendingAppointments({ onAppointmentChange }) {
    const { roleData } = useContext(UserContext);
    const navigate = useNavigate();
  
    const {
      data: pendingAppointments = [],
      isLoading
    } = useQuery({
      queryKey: queryKeys.appointments.pending(roleData.id),
      queryFn: async () => {
        const res = await fetch(
          API_URL + `/appointments/patient?patientId=${roleData.id}&status=2`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
      refetchOnWindowFocus: false
    });

    const queryClient = useQueryClient();
    if (isLoading) return <div>Loading...</div>;


    return (
      <Paper sx={{ p: "1rem", height: "100%" }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "1.4rem", mb: 2 }}>
          Upcoming Appointments
        </Typography>
  
        {pendingAppointments.length === 0 ? (
          <Typography>You have no pending appointments.</Typography>
        ) : (
          <Stack spacing={2}>
            {pendingAppointments.map((appointment, index) => {
              const date = new Date(appointment.appointmentTimestamp);
              const now = new Date();
              const canEnter = date <= now;
  
              return (
                <div key={appointment.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <Avatar src={appointment.doctor.user.imgUri} sx={{ width: 48, height: 48 }} />
                      <div>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {appointment.doctor.firstName} {appointment.doctor.lastName}, MD
                        </Typography>
                        <Typography sx={{ fontSize: ".8rem", color: "text.secondary" }}>
                          {appointment.doctor.specialty}
                        </Typography>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <Typography>
                        {date.toLocaleString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true
                        })}
                      </Typography>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                              justifyContent: "flex-end"
                            }}
                        >
                          <Button
                              variant="contained"
                              onClick={async () => {
                                try {
                                  await axios.patch(`${API_URL}/appointments/${appointment.id}/reject`, null, {
                                    withCredentials: true
                                  });
                                  toast.success("Appointment cancelled");
                                  queryClient.invalidateQueries(queryKeys.appointments.all)
                                  if (onAppointmentChange) onAppointmentChange();
                                } catch {
                                  toast.error("Cancel failed");
                                }
                              }}
                          >
                            Cancel
                          </Button>
                          <Tooltip title={!canEnter ? "Not ready yet" : ""}>
    <span>
      <Button
          variant="contained"
          color="error"
          disabled={!canEnter}
          onClick={() =>
              navigate(`/appointment/${appointment.id}/${appointment.doctor.id}`)
          }
      >
        Enter
      </Button>
    </span>
                          </Tooltip>
                        </div>

                      </div>
                    </div>
                  </div>
                  {index < pendingAppointments.length - 1 && <Divider sx={{ my: 2 }} />}
                </div>
              );
            })}
          </Stack>
        )}
      </Paper>
    );
  }
  