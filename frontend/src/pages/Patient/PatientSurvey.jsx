import {Button, Paper, Typography} from "@mui/material";
import {LineChart} from "@mui/x-charts/LineChart";

export default function PatientSurvey(){

   return (
      <Paper sx={{p:"1rem"}}>
          <Typography sx={{fontWeight:"bold", fontSize:"1.2rem"}}>Daily Survey</Typography>
          <Button>Take Daily survey</Button>
          <Button>Take weekly survey</Button>
          <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                  {
                      data: [2, 5.5, 2, 8.5, 1.5, 5],
                  },
              ]}
              height={200}
          ></LineChart>
      </Paper>
   )
}