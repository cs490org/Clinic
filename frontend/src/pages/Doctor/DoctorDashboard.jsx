import {
    Container,
    Typography,
    Paper,
    Box,
    TableContainer,
    TableHead,
    TableCell,
    Table,
    TableBody,
    CircularProgress, Skeleton, TableRow, Stack, Button, Divider
} from '@mui/material';
import {useState, useEffect} from "react";
import {API_URL} from "../../utils/constants.js";
import StyledCard from "../../components/StyledCard.jsx";
import dayjs from "dayjs";


const DoctorDashboard = () => {

    // TODO: get this from usercontext
    const doctor_id = 1


    const [appointments, setAppointments] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState("");


    useEffect(() => {
       const fetchAppointments = async () => {
           try {
               const response = await fetch(`${API_URL}/appointments/${doctor_id}`,
                   {
                       method: 'GET',
                       credentials: 'include',
                       headers: {
                           'Content-Type': 'application/json'
                       }
                   })
               if(!response.ok){
                   throw new Error("Failed to fetch upcoming appointments")

               }
               const data = await response.json()
               setAppointments(data)
           } catch(err){
               setError(err.message)
           } finally{
               setLoading(false)
           }
       }
       fetchAppointments()
    }, []);

    const AppointmentCard = ({name,time}) => {
        return (
            <StyledCard>
                <Stack spacing={1}>
                    <Box>
                        <Typography fontSize={"1.2rem"} fontWeight={"bold"}>{name}</Typography>
                    </Box>
                    <Box>
                        <Typography>{dayjs(time).format("MMMM D, YYYY")}</Typography>
                        <Typography>{dayjs(time).format("h:mm A")}</Typography>
                    </Box>
                   <Divider></Divider>
                    <Stack direction={"row"} justifyContent={"flex-end"} gap={.5}>
                        <Button variant={"contained"}>Accept</Button>
                        <Button variant={"outlined"}>Reject</Button>
                    </Stack>
                </Stack>
            </StyledCard>
        )
    }



  return (
    <Container  sx={{ mt: 4}}>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Stack spacing={2} maxWidth={300}>
        <Typography variant="h5"> Appointment Requests</Typography>
          {loading ?
              <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
              </Box>
              :
              error ?
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="error">{error}</Typography>
                  </Paper>
                  :
                  <Stack>
                      {
                          appointments.map((appointment,index) =>
                              <AppointmentCard
                                  key={index}
                                  name={ `${appointment.patient.user.firstName} ${appointment.patient.user.firstName}`}
                                  time={ appointment.appointmentTimestamp}
                              />
                          )
                      }
                  </Stack>
          }

      </Stack>
    </Container>
  );
};

export default DoctorDashboard; 