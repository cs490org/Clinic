import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../utils/constants.js";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AssignPrescription() {
    const { user, roleData } = useContext(UserContext);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedDrugId, setSelectedDrugId] = useState("");
    const [durationDays, setDurationDays] = useState("");
    const navigate = useNavigate();

    const handlePatientChange = (event) => {
        setSelectedPatientId(event.target.value);
    };

    const { data: patients, isLoading: loadingPatients } = useQuery({
        queryKey: ["doctor_patients"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/doctor/patients?doctorId=${roleData.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch patients');
            return res.json();
        }
    });

    const { data: drugs, isLoading: loadingDrugs } = useQuery({
        queryKey: ["drugs"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/drugs`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch drugs');
            return res.json();
        }
    });

    const submit = async () => {
        if (!selectedPatientId || !selectedDrugId || !durationDays) {
            toast.error("All fields are required.");
            return;
        }

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + parseInt(durationDays));

        const payload = {
            doctor_id: roleData.id,
            patient_id: selectedPatientId,
            drug_id: selectedDrugId,
            rx_expiry_timestamp: expiry.toISOString(),
            rx_status_code: 'ACTIVE'
        };

        try {
            const res = await fetch(`${API_URL}/doctor/prescriptions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to assign prescription");

            toast.success("Prescription assigned successfully!");
            navigate(-1);
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (patients?.length == 0) {

        return (
            <Typography>
                You currently have no assigned patients.
            </Typography>
        )
    }
    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: "2rem" }}>
                Assign prescription
            </Typography>

            <Typography>Choose patient</Typography>
            {
                loadingPatients ? (
                    <CircularProgress />
                ) : (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="patient-select-label">Patient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            value={selectedPatientId}
                            onChange={handlePatientChange}
                        >
                            {patients?.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                    {patient.firstName} {patient.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }

            <Typography sx={{ mt: 4 }}>Choose drug</Typography>

            {loadingDrugs ? (
                <CircularProgress />
            ) : (
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel id="drug-select-label">Drug</InputLabel>
                        <Select
                            labelId="drug-select-label"
                            value={selectedDrugId}
                            onChange={(e) => setSelectedDrugId(e.target.value)}
                        >
                            {drugs?.map((drug) => (
                                <MenuItem key={drug.id} value={drug.id}>
                                    {drug.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Duration (in days)"
                        type="number"
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        fullWidth
                    />

                    <Button variant="contained" onClick={submit}>Assign</Button>
                </Stack>
            )}
        </Container>
    );
}
