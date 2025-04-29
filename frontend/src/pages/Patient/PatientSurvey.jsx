import {Button, CircularProgress, Container, Paper, Stack, Typography} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys.js";
import { API_URL } from "../../utils/constants.js";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ThumbsUp from "../../assets/thumbs_up.png"
import {Image} from "@mui/icons-material";
export default function PatientSurvey() {
    const { roleData } = useContext(UserContext)
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.daily_surveys.all,
        queryFn: async () => {
            return fetch(API_URL + `/daily_surveys?patientId=${roleData.id}`).then((res) =>
                res.json()
            )
        }
    })

    if (isLoading) {
        return <CircularProgress></CircularProgress>
    }

    const dates = data.map((survey) => dayjs(survey.surveyDate))
    const calories = data.map((survey) => survey.caloriesEaten)
    const mood = data.map((survey) => survey.mood)

    return (
        <Paper sx={{ p: "1rem" }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Daily Survey</Typography>
            <Button>Take Daily survey</Button>
            {/* CALORIES*/}
            <Stack direction={"row"}>
                <LineChart
                    xAxis={[{
                        data: dates,
                        scaleType: "time",
                        valueFormatter: (date) => dayjs(date).format('MM/DD'),
                        tickMinStep: 3600 * 1000 * 24, // 1 day
                    }]}
                    series={[
                        {
                            data: calories,
                            label: "Calories",
                            showMark: true,
                        },
                    ]}
                    height={200}
                />
                <Box>
                    <Typography>Average Calories</Typography>
                    <Typography>{calories.reduce((acc,curr)=>curr+acc,0) / calories.length}</Typography>
                </Box>
            </Stack>

            {/* MOOD */}
            <Stack direction={"row"}>
                <LineChart
                    xAxis={[{
                        data: dates,
                        scaleType: "time",
                        valueFormatter: (date) => dayjs(date).format('MM/DD'),
                        tickMinStep: 3600 * 1000 * 24, // 1 day

                    }]}
                    yAxis={[{
                        min: 1,
                        tickMaxStep: 1
                    }]}
                    series={[
                        {
                            data: mood,
                            label: "Mood (1-10)",
                            color: "yellow",
                            showMark: true,
                        },
                    ]}
                    height={200}
                />
                <Box>
                    <Typography>Average Mood</Typography>
                    <Typography>{mood.reduce((acc,curr)=>curr+acc,0) / mood.length} / 10</Typography>
                    <Box width={"100px"} component="img" src={ThumbsUp}/>
                </Box>
            </Stack>
        </Paper>
    )
}