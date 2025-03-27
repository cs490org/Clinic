import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Collapse,
    Container,
    IconButton, Stack, styled,
    Typography
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";



export default function Recipes(){

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

    const RecipeCard = ({title,subheader,image,description,instructions}) =>{
        const [expanded,setExpanded] = useState();

        const handleExpandClick = () => {
            setExpanded(!expanded)
        }

        return (
            <Card sx={{maxWidth:600}}>
                <CardHeader
                    avatar={
                    <Avatar>
                        D
                    </Avatar>
                    }
                    title={title}
                    subheader={subheader}
                />
                <CardMedia
                component="img"
                height="600"
                image={image}
                alt={image}
                />
                <CardContent>
                    <Typography sx={{color:"text.secondary"}}>
                        {description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton>
                        <CommentIcon></CommentIcon>
                    </IconButton>

                    <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    >
                        <ExpandMoreIcon></ExpandMoreIcon>
                    </ExpandMore>

                </CardActions>
                <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                    <CardContent>

                    </CardContent>
                </Collapse>
            </Card>
        )
    }

    return (
        <Container sx={{display:"flex",justifyContent:"Center"}}>

            <Stack spacing={2}>
                <RecipeCard
                    title={"Honey Garlic Chicken"}
                    subheader={"March 30, 2025"}
                    image={"/src/assets/garlic_chicken.jpg"}
                    description={"Delicious honey garlic chicken with lower calories"}
                />
                <RecipeCard
                    title={"Honey Garlic Chicken"}
                    subheader={"March 30, 2025"}
                    image={"/src/assets/garlic_chicken.jpg"}
                    description={"Delicious honey garlic chicken with lower calories"}
                />
            </Stack>
        </Container>
    )

}