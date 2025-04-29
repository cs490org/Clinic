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
import {useQuery, useQueryClient} from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys.js";
import { API_URL } from "../../utils/constants.js";
import {useContext, useState} from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ThumbsUp from "../../assets/thumbs_up.png"
import {toast} from "sonner";
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
    const queryClient = useQueryClient()
    const {data:didDailySurvey} = useQuery({

        queryKey:queryKeys.daily_surveys.did,
        queryFn:async () => {
            return fetch(API_URL + `/daily_surveys/did_it?patientId=${roleData.id}`).then((res) =>
                res.json()
            )
        }
    })

    const [showDailySurveyForm, setShowDailySurveyForm] = useState(false)
    const [surveyCalories, setSurveyCalories] = useState(false)
    const [surveyMood, setSurveyMood] = useState(false)

    if (isLoading) {
        return <CircularProgress></CircularProgress>
    }

    const toggleShowDailySurvey = () =>{
        setShowDailySurveyForm(!showDailySurveyForm)
    }

    const submitDailySurvey = async () => {
        if (surveyMood < 1 || surveyMood > 10){
            toast.error("Mood must be between 1 and 10.")
            return
        }
        if (surveyCalories < 0){
            toast.error("Cannot enter negative calories.")
            return
        }
        if (surveyCalories > 5000){
            if(!window.confirm("Are you sure? thats a lot of calories.")) {
                return
            }
        }

        const response = await fetch(API_URL+"/daily_surveys",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                    patientId: roleData.id,
                    caloriesEaten:surveyCalories,
                    mood:surveyMood
                })
            }
        )

        if(response.ok){
            // window.location.reload()
            queryClient.invalidateQueries({queryKey:queryKeys.daily_surveys.all})
            toast.success("Did daily survey!")
        } else {
            toast.error("There was an error when doing the daily survey.")
        }

    }

    const dates = data.map((survey) => dayjs(survey.surveyDate))
    const calories = data.map((survey) => survey.caloriesEaten)
    const mood = data.map((survey) => survey.mood)

    return (
        <Paper sx={{ p: "1rem" }}>
            <Stack spacing={2}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Daily Survey</Typography>
                <Box width={"40%"}>
                    {
                        !didDailySurvey ?
                    <Button variant={"contained"} onClick={()=>toggleShowDailySurvey()}>Take Daily survey</Button>
                            :
                    <Button disabled={true}variant={"contained"}  >Completed daily survey!</Button>
                    }
                    {showDailySurveyForm && !didDailySurvey &&
                    <Stack sx={{mt:"1rem"}}spacing={1} direction={"column"}>
                        <TextField onChange={(e)=>setSurveyCalories(e.target.value)} label="Calories" ></TextField>
                        <TextField onChange={(e)=>setSurveyMood(e.target.value)} type="number" label="Mood (1-10)" ></TextField>
                        <Button variant={"contained"} onClick={()=>submitDailySurvey()}>Submit</Button>
                    </Stack>
                    }
                </Box>
                {/* CALORIES*/}
                <Stack direction={"row"}>
                    {console.log(dates)}
                    {console.log(calories)}
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
                        <Typography>{calories.reduce((acc, curr) => curr + acc, 0) / calories.length}</Typography>
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
                        <Typography>{mood.reduce((acc, curr) => curr + acc, 0) / mood.length} / 10</Typography>
                        <Box width={"100px"} component="img" src={ThumbsUp} />
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    )
}