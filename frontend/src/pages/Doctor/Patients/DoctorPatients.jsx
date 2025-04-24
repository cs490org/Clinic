import {Box, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import {useContext} from "react";
import {API_URL} from "../../../utils/constants";
import {useQuery} from "@tanstack/react-query";
import {UserContext} from "../../../contexts/UserContext";
import {queryKeys} from "../../../utils/queryKeys";

const DoctorPatients = () => {
    const { user,roleData } = useContext(UserContext);

    const { data: patients, isLoading, error } = useQuery({
        queryKey: queryKeys.patients.byDoctor(roleData?.id),
        queryFn: () =>
            fetch(`${API_URL}/doctors/${roleData?.id}/patients`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()),
        //enabled: !!roleData?.id
    });

    const PatientCard = ({ name, email, phone }) => (
        <Paper sx={{ p: 2 }}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box>
                    <Typography fontSize={"1.2rem"} fontWeight={"medium"}>{name}</Typography>
                    <Typography>Email: {email}</Typography>
                    <Typography>Phone: {phone}</Typography>
                </Box>
            </Stack>
        </Paper>
    );

    return (
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="h5" fontWeight={"bold"}>My Patients</Typography>

            {isLoading ?
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
                : error ?
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="error">Failed to load patients</Typography>
                    </Paper>
                    : patients.length === 0 ?
                        <Paper sx={{ p: 3 }}>
                            <Typography>You currently have no patients</Typography>
                        </Paper>
                        :
                        <Stack spacing={2}>
                            {patients.map((patient, index) => (
                            <PatientCard
                                key={index}
                                name={`${patient.firstName} ${patient.lastName}`}
                                email={patient.email}
                                phone={patient.phone}
                            />
                    ))}
                </Stack>
            }
        </Paper>
    );
};

export default DoctorPatients;
