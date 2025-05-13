import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../../../utils/constants.js";
import {
    Button,
    FormControl,
    MenuItem, Paper,
    Select,
    Skeleton, Stack,
    Typography
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../../../utils/queryKeys.js";

export default function SelectPharmacy() {

    const [selectedPharmacy, setSelectedPharmacy] = useState("")
    const fetchPharmacies = async () => {
        const {data} = await axios.get(API_URL + "/pharmacies", {withCredentials: true})
        return data
    }
    const {data: pharmacies, isLoading, isError, error} = useQuery({
        queryKey: queryKeys.pharmacies.all,
        queryFn: fetchPharmacies,
    })

// WIP
    return (
        <Paper sx={{p: 2}}>
            <Typography fontWeight={"bold"}>
                Preferred Pharmacy
            </Typography>
            {isLoading ?
                <Skeleton></Skeleton>
                :
                isError ?
                    <Typography color={"error"}>An error occured while trying to fetch
                        pharmacies.</Typography>
                    :
                    <FormControl fullWidth>
                        {/*<InputLabel>Select Pharmacy</InputLabel>*/}
                        <Stack>
                            <Select
                                value={selectedPharmacy} onChange={(e) => setSelectedPharmacy(e.target.value)}>
                                {
                                    pharmacies?.map((pharmacy, index) => (
                                        <MenuItem key={index} value={pharmacy.id}>{pharmacy.name}</MenuItem>
                                    ))}
                            </Select>
                            <Button
                                variant={"outlined"}>Submit</Button>
                        </Stack>
                    </FormControl>
            }
        </Paper>
    )


}