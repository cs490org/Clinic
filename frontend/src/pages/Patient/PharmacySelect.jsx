// import { useState, useEffect } from 'react';
// import { FormControl, InputLabel, MenuItem, Select, Skeleton, Typography } from "@mui/material";
// import { API_URL } from "../../utils/constants";
// import { toast } from "sonner";
//
// export default function PharmacySelect({ zip, value, onChange }) {
//     const [pharmacies, setPharmacies] = useState([]);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         const fetchPharmacies = async () => {
//             if (!/^\d{5}$/.test(zip)) {
//                 setPharmacies([]);
//                 return;
//             }
//             setLoading(true);
//             try {
//                 const res = await fetch(`${API_URL}/pharmacies/nearby?zipCode=${zip}`, {
//                     credentials: 'include',
//                 });
//                 const data = await res.json();
//                 setPharmacies(data);
//             } catch (err) {
//                 toast.error("Error fetching pharmacies");
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPharmacies();
//     }, [zip]);
//
//     return (
//         <FormControl fullWidth required>
//             {loading ? (
//                 <Skeleton />
//             ) : pharmacies.length === 0 ? (
//                 <Typography variant="body2" sx={{ mt: 1 }}>No nearby pharmacies found.</Typography>
//             ) : (
//                 <Select value={value} onChange={onChange} >
//                     {pharmacies.map(pharmacy => (
//                         <MenuItem key={pharmacy.id} value={pharmacy.id}>
//                             <Typography
//                                 variant="body2"
//                                 sx={{
//                                     whiteSpace: 'normal',
//                                     wordBreak: 'break-word',
//                                     fontSize: {
//                                         xs: '0.75rem',
//                                         sm: '0.875rem',
//                                     }
//                                 }}
//                             >
//                                 {pharmacy.name} - {pharmacy.address} - {pharmacy.zipCode}
//                             </Typography>
//                         </MenuItem>
//                     ))}
//                 </Select>
//             )}
//         </FormControl>
//     );
// }


import { useState, useEffect } from 'react';
import { FormControl, Skeleton, Typography, Stack, Paper } from "@mui/material";
import { API_URL, PHARMACY_API_URL } from "../../utils/constants";
import { toast } from "sonner";

export default function PharmacySelect({ zip, value, onChange }) {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPharmacies = async () => {
            if (!/^\d{5}$/.test(zip)) {
                setPharmacies([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`${PHARMACY_API_URL}/pharmacies/nearby?zipCode=${zip}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setPharmacies(data);
            } catch (err) {
                toast.error("Error fetching pharmacies");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPharmacies();
    }, [zip]);

    return (
        <FormControl fullWidth required>
            {loading ? (
                <Skeleton />
            ) : pharmacies.length === 0 ? (
                <Typography variant="body2" sx={{ mt: 1 }}>No nearby pharmacies found.</Typography>
            ) : (
                <Stack spacing={1}>
                    {pharmacies.map(pharmacy => (
                        <Paper
                            key={pharmacy.id}
                            onClick={() => onChange({ target: { value: pharmacy.id } })}
                            sx={{
                                p: 1,
                                cursor: 'pointer',
                                backgroundColor: pharmacy.id === value ? 'primary.light' : 'background.paper',
                                '&:hover': { backgroundColor: 'action.hover' }
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem',
                                    }
                                }}
                            >
                                {pharmacy.name} - {pharmacy.address} - {pharmacy.zipCode}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            )}
        </FormControl>
    );
}
