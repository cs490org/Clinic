import {useState} from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
    Tabs,
    Tab,
    Checkbox,
    FormControlLabel,
    Divider,
    MenuItem, Select, FormControl,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../utils/constants";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../utils/queryKeys.js";

const SPECIALTIES = [
    "Weight Loss",
    "Weight Gain",
    "Nutrition",
    "Physical Therapy"
];

const SignupPage = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const initialUserType = urlParams.get("userType") || "patient";

    // AUTH
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAgreed, setTermsAgreed] = useState('');

    // PATIENT
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedPharmacy, setSelectedPharmacy] = useState("")

    // DOCTOR
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');

    // PHARMACIST
    const [pharmacyName, setPharmacyName] = useState('');
    const [pharmacyAddress, setPharmacyAddress] = useState('');
    const [pharmacyPhone, setPharmacyPhone] = useState('');
    const [pharmacyZipCode, setPharmacyZipCode] = useState('');


    const [userType, setUserType] = useState(initialUserType);

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    const handleUserTypeChange = (event, newValue) => {
        setUserType(newValue);
        setErrors({});
    };

    const register = async (event) => {
        event.preventDefault();
        const res = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (res.status == 200) {
            navigate('/');
        } else if (res.status == 202) {
            // TODO: introduce error displays
            // setError('Account already exists.')
        }
    }

    const fetchPharmacies = async () => {
        const {data} = await axios.get(API_URL + "/pharmacies", {withCredentials: true})
        return data
    }
    const {data: pharmacies, isLoading, isError, error} = useQuery({
        queryKey: queryKeys.pharmacies.all,
        queryFn: fetchPharmacies,
    })

    return (
        <Container maxWidth="sm" sx={{maxWidth: '700px'}}>
            <Stack
                spacing={3}
                sx={{
                    minHeight: '100vh',
                    py: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" gutterBottom>
                        Sign Up
                    </Typography>

                    <Tabs
                        value={userType}
                        onChange={handleUserTypeChange}
                        variant="fullWidth"
                        sx={{width: '100%', mb: 3}}
                    >
                        <Tab label="Patient" value="patient"/>
                        <Tab label="Doctor" value="doctor"/>
                        <Tab label="Pharmacist" value="pharmacist"/>
                    </Tabs>

                    <form onSubmit={register} style={{width: '100%'}}>
                        <Stack spacing={2} sx={{width: '100%'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                <TextField
                                    name="firstName"
                                    required
                                    fullWidth
                                    label="First Name"
                                    autoComplete="given-name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.currentTarget.value)}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                />

                                <TextField
                                    name="lastName"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.currentTarget.value)}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                />
                            </Stack>

                            <TextField
                                name="email"
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                name="password"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <TextField
                                name="confirmPassword"
                                required
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />

                            {userType === "patient" && (
                                <>
                                    <Divider>Patient Information</Divider>
                                    <TextField
                                        name="address"
                                        required
                                        fullWidth
                                        label="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.currentTarget.value)}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        multiline
                                        rows={2}
                                    />
                                    <TextField
                                        name="phone"
                                        required
                                        fullWidth
                                        label="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.currentTarget.value)}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        placeholder="(123) 456-7890"
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*'
                                        }}
                                    />
                                    <FormControl fullWidth>
                                        {/*<InputLabel>Select Pharmacy</InputLabel>*/}
                                        <Stack>
                                            <Select
                                                value={selectedPharmacy}
                                                onChange={(e) => setSelectedPharmacy(e.target.value)}>
                                                {
                                                    pharmacies?.map((pharmacy, index) => (
                                                        <MenuItem key={index}
                                                                  value={pharmacy.id}>{pharmacy.name}</MenuItem>
                                                    ))}
                                            </Select>
                                            <Button
                                                variant={"outlined"}>Submit</Button>
                                        </Stack>
                                    </FormControl>
                                </>
                            )}

                            {userType === "doctor" && (
                                <>
                                    <Divider>Doctor Information</Divider>
                                    <TextField
                                        select
                                        name="specialization"
                                        required
                                        fullWidth
                                        label="Specialization"
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.currentTarget.value)}
                                        error={!!errors.specialization}
                                        helperText={errors.specialization}
                                    >
                                        {SPECIALTIES.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        name="licenseNumber"
                                        required
                                        fullWidth
                                        label="License Number"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.currentTarget.value)}
                                        error={!!errors.licenseNumber}
                                        helperText={errors.licenseNumber}
                                    />
                                    <TextField
                                        name="phone"
                                        required
                                        fullWidth
                                        label="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.currentTarget.value)}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        placeholder="(123) 456-7890"
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*'
                                        }}
                                    />
                                </>
                            )}

                            {userType === "pharmacist" && (
                                <>
                                    <Divider>Pharmacy Information</Divider>
                                    <TextField
                                        name="pharmacyName"
                                        required
                                        fullWidth
                                        label="Pharmacy Name"
                                        value={pharmacyName}
                                        onChange={(e) => setPharmacyName(e.currentTarget.value)}
                                        error={!!errors.pharmacyName}
                                        helperText={errors.pharmacyName}
                                    />
                                    <TextField
                                        name="pharmacyAddress"
                                        required
                                        fullWidth
                                        label="Pharmacy Address"
                                        value={pharmacyAddress}
                                        onChange={(e) => setPharmacyAddress(e.currentTarget.value)}
                                        error={!!errors.pharmacyAddress}
                                        helperText={errors.pharmacyAddress}
                                    />
                                    <TextField
                                        name="pharmacyPhone"
                                        required
                                        fullWidth
                                        label="Pharmacy Phone Number"
                                        value={pharmacyPhone}
                                        onChange={(e) => setPharmacyPhone(e.currentTarget.value)}
                                        error={!!errors.pharmacyPhone}
                                        helperText={errors.pharmacyPhone}
                                        placeholder="(123) 456-7890"
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*'
                                        }}
                                    />
                                    <TextField
                                        name="pharmacyZipCode"
                                        required
                                        fullWidth
                                        label="ZIP Code"
                                        value={pharmacyZipCode}
                                        onChange={(e) => setPharmacyZipCode(e.currentTarget.value)}
                                        error={!!errors.pharmacyZipCode}
                                        helperText={errors.pharmacyZipCode}
                                        placeholder="12345"
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9-]*',
                                            maxLength: 10
                                        }}
                                    />
                                </>
                            )}

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="agreeToTerms"
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.currentTarget.checked)}
                                        color="primary"
                                    />
                                }
                                label="I agree to the terms and conditions"
                            />
                            {errors.agreeToTerms && (
                                <Typography color="error" variant="caption">
                                    {errors.agreeToTerms}
                                </Typography>
                            )}

                            {submitError && (
                                <Alert severity="error">
                                    {submitError}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Stack>
        </Container>
    );
};

export default SignupPage;
