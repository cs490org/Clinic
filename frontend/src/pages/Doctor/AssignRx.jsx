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
    const { roleData } = useContext(UserContext);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedDrugId, setSelectedDrugId] = useState("");
    const [dosage, setDosage] = useState("");
    const navigate = useNavigate();

    const pharmacyId = 1; // Replace with actual pharmacy ID or derive from context

    const { data: patients, isLoading: loadingPatients } = useQuery({
        queryKey: ["doctor_patients"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/doctor/patients?doctorId=${roleData.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error("Failed to fetch patients");
            return res.json();
        }
    });

    const { data: drugs, isLoading: loadingDrugs } = useQuery({
        queryKey: ["drugs", pharmacyId],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/pharmacies/drugs?pharmacyId=${pharmacyId}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error("Failed to fetch drugs");
            return res.json();
        }
    });

    const submit = async () => {
        if (!selectedPatientId || !selectedDrugId || !dosage) {
            toast.error("All fields are required.");
            return;
        }

        const payload = {
            patientId: selectedPatientId,
            drugId: selectedDrugId,
            doctorId: roleData.id,
            rxExpiryTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() // e.g. 30 days from now
        };

        try {
            const res = await fetch(`${API_URL}/prescriptions`, {
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

    if (patients?.length === 0) {
        return (
            <Typography>
                You currently have no assigned patients.
            </Typography>
        );
    }

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: "2rem" }}>
                Assign Prescription
            </Typography>

            <Typography>Choose patient</Typography>
            {loadingPatients ? (
                <CircularProgress />
            ) : (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        variant="outlined"
                    >
                        {patients?.map((patient) => (
                            <MenuItem key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Typography sx={{ mt: 4 }}>Choose Drug</Typography>
            {loadingDrugs ? (
                <CircularProgress />
            ) : (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="drug-select-label">Drug</InputLabel>
                    <Select
                        labelId="drug-select-label"
                        value={selectedDrugId}
                        onChange={(e) => setSelectedDrugId(e.target.value)}
                        variant="standard"
                    >
                        {drugs?.map((drug) => (
                            <MenuItem key={drug.id} value={drug.drug.id}>
                                {drug.drug.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Typography sx={{ mt: 4 }}>Dosage</Typography>
            <TextField
                fullWidth
                placeholder="e.g. 500mg twice daily"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                sx={{ mt: 2 }}
            />

            <Stack sx={{ mt: 4 }} direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={submit}>Assign</Button>
            </Stack>
        </Container>
    );
}
