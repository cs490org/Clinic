import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    Divider, IconButton, Stack, styled, TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useState} from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import dayjs from "dayjs";
export default function RecipeCard({author,recipeName,createTimestamp,image,description}) {
    const [expanded,setExpanded] = useState();

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme }) => ({
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        variants: [
            {
                // expand is false
                props: ({ expand }) => !expand,
                style: {
                    transform: 'rotate(0deg)',
                },
            },
            {
                //expand is true
                props: ({ expand }) => !!expand,
                style: {
                    transform: 'rotate(180deg)',
                },
            },
        ],
    }));

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    return (
        <Card sx={{minWidth:300,maxWidth:600}}>
            <CardHeader
                avatar={
                <Avatar>
                    D
                </Avatar>
                }
                title={
                <Typography>
                    {author}
                </Typography>
                    }
                subheader={dayjs(createTimestamp).format('MMMM D, YYYY')}
            />
            <CardMedia
            component="img"
            image={image}
            alt={image}
            />
            <CardContent>
                <Typography sx={{fontWeight:"medium",fontSize:"1.15rem"}}>
                    {recipeName}
                </Typography>
                <Divider />
                <Typography sx={{color:"text.secondary",fontSize:".95rem"}}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>

                <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                >
                    <ExpandMoreIcon></ExpandMoreIcon>
                </ExpandMore>

            </CardActions>
            <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                <CardContent>
                    <>
                        {/*<Typography sx={{color:"text.secondary"}}>Comments: </Typography>*/}

                        <Stack direction={"row"} spacing={1} width={"100%"}>
                            <TextField fullWidth placeholder={"Type a comment..."}/>
                            <IconButton><ArrowUpwardIcon/></IconButton>

                        </Stack>

                    </>
                </CardContent>
            </Collapse>
        </Card>
    )
}
