import {Card, Paper} from "@mui/material";

const StyledCard = ({children}) =>{
    return (
        <Card sx={{p:2}}>
            {children}
        </Card>
    )
}

export default StyledCard