import {
    Avatar, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Collapse,
    Container, Divider,
    IconButton, Stack, styled, TextField,
    Typography
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useEffect, useState} from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {API_URL} from "../../utils/constants.js";


export default function Recipes(){


    const RecipeCard = ({author,recipeName,subheader,image,description}) =>{
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
                    title={author}
                    subheader={subheader}
                />
                <CardMedia
                component="img"
                height="600"
                width="600"
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


    const [recipes,setRecipes] = useState([])
    useEffect(() => {
        const run = async () => {
            const response = await fetch(API_URL+"/recipes",
                {
                    method:"GET",
                    credentials:"include"
                }
            )
            const data = await response.json()
            setRecipes(data)
        }
        run()
    }, []);



    const mockData = [{
        author: "Doctor Dump Ling",
        subheader : "March 30, 2025",
        image :"/src/assets/garlic_chicken.jpg",
        recipeName: "Honey Garlic Chicken",
        description: "Delicious honey garlic chicken with lower calories",
    }]
    return (
        <Container sx={{display:"flex",justifyContent:"Center"}}>

            <Stack spacing={2}>
                {/*{mockData.map((recipe,i)=>{*/}

                {/*    return <RecipeCard*/}
                {/*        key={i}*/}
                {/*        author={recipe.author}*/}
                {/*        subheader={recipe.subheader}*/}
                {/*        image={recipe.image}*/}
                {/*        recipeName={recipe.recipeName}*/}
                {/*        description={recipe.description}*/}
                {/*    />*/}
                {/*})}*/}
                {recipes.length === 0 &&
                <Typography>No recipes found.</Typography>
                }

                {recipes.length > 0 &&
                    recipes.map((recipe,i)=>{
                        return <RecipeCard
                            key={i}
                            author={recipe.author}
                            recipeName={recipe.name}
                            description={recipe.description}
                        />

                    })
                }
            </Stack>
        </Container>
    )

}