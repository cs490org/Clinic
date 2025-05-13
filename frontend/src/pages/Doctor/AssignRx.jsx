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
import {API_URL, PHARMACY_API_URL} from "../../utils/constants.js";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { convertLength } from "@mui/material/styles/cssUtils.js";

export default function AssignPrescription() {
    const { roleData } = useContext(UserContext);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [pharmacyId, setPharmacyId] = useState(null);
    const [selectedDrugId, setSelectedDrugId] = useState("");

    const defaultExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 16);
    const [rxExpiryTimestamp, setRxExpiryTimestamp] = useState(defaultExpiry);

    const navigate = useNavigate();

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

    // Fetch patient's preferred pharmacy when patient is selected
    useEffect(() => {
        if (!selectedPatientId) return;
        const fetchPharmacy = async () => {
            try {
                const res = await fetch(`${API_URL}/patients/preferred_pharmacy?patientId=${selectedPatientId}`, {
                    credentials: 'include'
                });
                if (!res.ok) throw new Error("Failed to fetch pharmacy");
                const data = await res.json();
                setPharmacyId(data.id);
            } catch (err) {
                toast.error("Error loading preferred pharmacy");
                setPharmacyId(null);
            }
        };
        fetchPharmacy();
        setSelectedDrugId(""); // reset drug selection when patient changes
    }, [selectedPatientId]);

    const { data: drugs, isLoading: loadingDrugs } = useQuery({
        queryKey: ["drugs", pharmacyId],
        queryFn: async () => {
            if (!pharmacyId) return []; //this one is good because it only gets the drugs which pharmacy has in stock
                const res = await fetch(`${PHARMACY_API_URL}/pharmacies/drugs?pharmacyId=${pharmacyId}`, {
                    credentials: 'include'
                });
            /*const res = await fetch(`${API_URL}/drugs`, {  // gets ALL drugs breaking the constraint on pharmacy end
                credentials: 'include'
            });*/
            if (!res.ok) throw new Error("Failed to fetch drugs");
            return res.json();
        },
        enabled: !!pharmacyId // only run query if pharmacyId is set
    });

    const submit = async () => {
        if (!selectedPatientId || !selectedDrugId || !rxExpiryTimestamp) {
            toast.error("All fields are required.");
            return;
        }

        const payload = {
            patientId: selectedPatientId,
            drugId: selectedDrugId,
            rxExpiryTimestamp,
            doctorId: roleData.id
        };

        try {
            const res = await fetch(`${PHARMACY_API_URL}/prescription`, {
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
        return <Typography>You currently have no assigned patients.</Typography>;
    }

    return (
        <Container>
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: "2rem" }}>
                Assign Prescription
            </Typography>

            <Typography>Choose Patient</Typography>
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
                        disabled={!pharmacyId}
                    >
                        {drugs?.map((wrapper) => ( //wrapper cuz thats the only way it can access right data from response it gets
                            <MenuItem key={wrapper.drug.id} value={wrapper.drug.id}>
                                {wrapper.drug.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Typography sx={{ mt: 4 }}>Expiration Date</Typography>
            <TextField
                type="datetime-local"
                fullWidth
                value={rxExpiryTimestamp}
                onChange={(e) => setRxExpiryTimestamp(e.target.value)}
                inputProps={{
                    min: new Date().toISOString().slice(0, 16)
                }}
                sx={{ mt: 2 }}
            />

            <Stack sx={{ mt: 4 }} direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={submit}>Assign</Button>
            </Stack>
        </Container>
    );
}