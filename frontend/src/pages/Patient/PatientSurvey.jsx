import {
    Accordion,
    AccordionDetails, AccordionSummary,
    Button,
    CircularProgress,
    Container,
    Paper,
    Stack, TextField,
    Typography
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys.js";
import { API_URL } from "../../utils/constants.js";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ThumbsUp from "../../assets/thumbs_up.png"
import { toast } from "sonner";

// monolith for all things daily and weekly survey
export default function PatientSurvey() {
    const { roleData } = useContext(UserContext)
    const { data: daily_surveys, isLoading: daily_surveys_loading } = useQuery({
        queryKey: queryKeys.daily_surveys.all,
        queryFn: async () => {
            return fetch(API_URL + `/daily_surveys?patientId=${roleData.id}`).then((res) =>
                res.json()
            )
        }
    })
    const { data: weekly_surveys, isLoading: weekly_surveys_loading } = useQuery({
        queryKey: queryKeys.weekly_surveys.all,
        queryFn: async () => {
            return fetch(API_URL + `/weekly_surveys?patientId=${roleData.id}`).then((res) =>
                res.json()
            )
        }
    })
    const queryClient = useQueryClient()
    const { data: didDailySurvey} = useQuery({

        queryKey: queryKeys.daily_surveys.did,
        queryFn: async () => {
            return fetch(API_URL + `/daily_surveys/did_it?patientId=${roleData.id}`).then((res) =>
                res.json()
            )
        }
    })
    const { data: didWeeklySurvey} = useQuery({

        queryKey: queryKeys.weekly_surveys.did,
        queryFn: async () => {
            return fetch(API_URL + `/weekly_surveys/did_it?patientId=${roleData.id}`).then((res) =>
                res.json()
            )
        }
    })

    const [showDailySurveyForm, setShowDailySurveyForm] = useState(false)
    const [showWeeklySurveyForm, setShowWeeklySurveyForm] = useState(false)
    const [surveyCalories, setSurveyCalories] = useState(false)
    const [surveyMood, setSurveyMood] = useState(false)
    const [surveyWeight, setSurveyWeight] = useState(false)

    if (daily_surveys_loading || weekly_surveys_loading) {
        return <CircularProgress></CircularProgress>
    }

    const toggleShowDailySurvey = () => {
        setShowDailySurveyForm(!showDailySurveyForm)
    }
    const toggleShowWeeklySurvey= () => {
        setShowWeeklySurveyForm(!showWeeklySurveyForm)
    }

    const submitDailySurvey = async () => {
        if (surveyMood < 1 || surveyMood > 10) {
            toast.error("Mood must be between 1 and 10.")
            return
        }
        if (surveyCalories < 0) {
            toast.error("Cannot enter negative calories.")
            return
        }
        if (surveyCalories > 5000) {
            if (!window.confirm("Are you sure? thats a lot of calories.")) {
                return
            }
        }

        const response = await fetch(API_URL + "/daily_surveys",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    patientId: roleData.id,
                    caloriesEaten: surveyCalories,
                    mood: surveyMood
                })
            }
        )

        if (response.ok) {
            // window.location.reload()
            queryClient.invalidateQueries({ queryKey: queryKeys.daily_surveys.all })
            toast.success("Did daily survey!")
        } else {
            toast.error("There was an error when doing the daily survey.")
        }
    }
    const submitWeeklySurvey= async () => {
        if (surveyWeight< 0) {
            toast.error("Cannot enter negative calories.")
            return
        }

        const response = await fetch(API_URL + "/weekly_surveys",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    patientId: roleData.id,
                    weight:surveyWeight,
                })
            }
        )

        if (response.ok) {
            queryClient.invalidateQueries({ queryKey: queryKeys.weekly_surveys.all })
            toast.success("Did weekly survey!")
        } else {
            toast.error("There was an error when doing the weekly survey.")
        }
    }

    const daily_dates = daily_surveys.map((survey) => dayjs(survey.surveyDate))
    const daily_calories = daily_surveys.map((survey) => survey.caloriesEaten)
    const daily_mood = daily_surveys.map((survey) => survey.mood)

    const weekly_dates= weekly_surveys.map((survey) => dayjs(survey.startDate))
    const weekly_weight= weekly_surveys.map((survey) => survey.weight)

    return (
        <Paper sx={{ p: "1rem" }}>
            <Stack spacing={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Daily and Weekly Survey</Typography>
                <Box width={"40%"}>
                    <Box sx={{display:"flex", gap:".5rem"}}>
                        {
                            !didDailySurvey ?
                                <Button variant={"contained"} onClick={() => toggleShowDailySurvey()}>Take Daily survey</Button>
                                :
                                <Button disabled={true} variant={"contained"}  >Completed daily survey!</Button>
                        }
                        {
                            !didWeeklySurvey?
                                <Button variant={"contained"} onClick={() => toggleShowWeeklySurvey()}>Take Weekly survey</Button>
                                :
                                <Button disabled={true} variant={"contained"}  >Completed weekly survey!</Button>
                        }
                    </Box>
                    {
                        showDailySurveyForm && !didDailySurvey &&
                        <Stack sx={{ mt: "1rem" }} spacing={1} direction={"column"}>
                            <TextField onChange={(e) => setSurveyCalories(e.target.value)} label="Calories" ></TextField>
                            <TextField onChange={(e) => setSurveyMood(e.target.value)} type="number" label="Mood (1-10)" ></TextField>
                            <Button variant={"contained"} onClick={() => submitDailySurvey()}>Submit</Button>
                        </Stack>
                    }
                    {
                        showWeeklySurveyForm&& !didWeeklySurvey &&
                        <Stack sx={{ mt: "1rem" }} spacing={1} direction={"column"}>
                            <TextField onChange={(e) => setSurveyWeight(e.target.value)} label="Weight (lbs)" ></TextField>
                            <Button variant={"contained"} onClick={() => submitWeeklySurvey()}>Submit</Button>
                        </Stack>
                    }
                </Box>
                {/* CALORIES*/}
                <Stack direction={"row"}>
                    <LineChart
                        xAxis={[{
                            data: daily_dates,
                            scaleType: "point",
                            valueFormatter: (date) => dayjs(date).format('MM/DD'),
                            tickMinStep: 3600 * 1000 * 24, // 1 day
                            label: "Day"
                        }]}
                        yAxis={[{
                            label: "Calories"
                        }]}
                        series={[
                            {
                                data: daily_calories,
                                label: "Calories",
                                showMark: true,
                            },
                        ]}
                        height={200}
                    />
                    {
                        daily_calories &&
                    <Box>
                        <Typography>Average Calories</Typography>
                        <Typography>{daily_calories.reduce((acc, curr) => curr + acc, 0) / daily_calories.length}</Typography>
                    </Box>
                    }
                </Stack>

                {/* MOOD */}
                <Stack direction={"row"}>
                    <LineChart
                        xAxis={[{
                            data: daily_dates,
                            scaleType: "point",
                            valueFormatter: (date) => dayjs(date).format('MM/DD'),
                            tickMinStep: 3600 * 1000 * 24, // 1 day
                            label: "Day"
                        }]}
                        yAxis={[{
                            min: 1,
                            tickMaxStep: 1,
                            label: "Mood"
                        }]}
                        series={[
                            {
                                data: daily_mood,
                                label: "Mood (1-10)",
                                color: "yellow",
                                showMark: true,
                            },
                        ]}
                        height={200}
                    />
                    {
                        daily_mood &&
                    <Box>
                        <Typography>Average Mood</Typography>
                        <Typography>{daily_mood.reduce((acc, curr) => curr + acc, 0) / daily_mood.length} / 10</Typography>
                        <Box width={"100px"} component="img" src={ThumbsUp} />
                    </Box>
                    }
                </Stack>

                {/* WEEKLY WEIGHT */}
                <Stack direction={"row"}>
                    <LineChart
                        xAxis={[{
                            data: weekly_dates,
                            scaleType: "point",
                            // valueFormatter: (date) => dayjs(date).format('MM/DD'),
                            valueFormatter: (date) =>{
                                return (
                                    dayjs(date).format('MM/DD')
                                    + " - " +
                                    dayjs(date).add(6, "day").format('MM/DD')
                                )
                            },

                            label: "Week"
                        }]}
                        yAxis={[{
                            tickMaxStep: 1,
                            label: "Weight"
                        }]}
                        series={[
                            {
                                data: weekly_weight,
                                label: "Weight (lbs)",
                                color: "green",
                                showMark: true,
                            },
                        ]}
                        height={200}
                    />
                    {/*<Box>*/}
                    {/*    <Typography>Average weight</Typography>*/}
                    {/*    <Typography>{daily_mood.reduce((acc, curr) => curr + acc, 0) / daily_mood.length} / 10</Typography>*/}
                    {/*    <Box width={"100px"} component="img" src={ThumbsUp} />*/}
                    {/*</Box>*/}
                </Stack>
            </Stack>
        </Paper>
    )
}