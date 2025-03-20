import {useState} from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../../utils/constants";
import {toast} from "sonner";
import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext";

const CompleteDoctorProfile = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const [formData, setFormData] = useState({
        phone: "",
        specialty: "",
        licenseNumber: "",
    });
    const [errors, setErrors] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL + "/doctors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userId: user.id,
                    ...formData,
                }),
            });

            if (response.ok) {
                toast.success("Profile created successfully!");
                navigate("/doctor/dashboard", {replace: true});

                // ensure we get role info
                window.location.reload()

            } else {
                //TODO: Check license i guess?
                const data = await response.json()
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Container maxWidth="xs" sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: "80vh"
        }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Complete Doctor Profile
                </Typography>

                <form onSubmit={handleSubmit} style={{width: "100%"}}>
                    <Stack spacing={2} sx={{mt: 2}}>


                        <TextField
                            name="phone"
                            required
                            fullWidth
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <TextField
                            name="specialty"
                            required
                            fullWidth
                            label="Specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                        />

                        <TextField
                            name="licenseNumber"
                            required
                            fullWidth
                            label="License Number"
                            type="number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                        />


                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                        >
                            Complete Profile
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default CompleteDoctorProfile; 