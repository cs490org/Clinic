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
import { useEffect, useState } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import dayjs from "dayjs";
import { API_URL } from "../../utils/constants.js";
import { toast } from "sonner";
import Box from "@mui/material/Box";
export default function RecipeCard({ id, author, recipeName, createTimestamp, image, description }) {
    const [comments, setComments] = useState([])
    const [expanded, setExpanded] = useState();

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

    useEffect(() => {
        const run = async () => {
            try {
                const response = await fetch(API_URL + "/recipes/comments?recipeId=" + id,

                    {
                        method: "GET",
                        credentials: "include"
                    }
                )
                const data = await response.json()
                // console.log(data)
                setComments(data)
            } catch (e) {
                toast.error("Something went wrong when trying to comment.")
                console.log(e)
            }
        }
        run()
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    return (
        <Card variant={"elevation"} elevation={1} sx={{ minWidth: 300, maxWidth: 600 }}>
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
                <Typography sx={{ fontWeight: "medium", fontSize: "1.15rem" }}>
                    {recipeName}
                </Typography>
                <Divider />
                <Typography sx={{ color: "text.secondary", fontSize: ".95rem" }}>
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

                        {comments.length === 0 && <Typography>No comments found.</Typography>}
                        {comments.length > 0 &&
                            comments.map((commentDTO,i)=>{
                                return (
                                        <Stack mb="1rem" key={i} direction={"row"} spacing={1.5}>
                                            <Avatar>D</Avatar>
                                            <Stack>

                                                    <Typography sx={{fontSize:"1.05rem",fontWeight:"bold"}}>{commentDTO.commenter}</Typography>
                                                    <Typography >{commentDTO.comment}</Typography>
                                            </Stack>
                                        </Stack>
                                )
                            })
                        }

                        <Stack direction={"row"} spacing={1} width={"100%"}>
                            <TextField fullWidth placeholder={"Type a comment..."} />
                            <IconButton><ArrowUpwardIcon /></IconButton>

                        </Stack>

                    </>
                </CardContent>
            </Collapse>
        </Card>
    )
}
