import {
    Avatar, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    Divider, IconButton, Stack,  TextField,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import dayjs from "dayjs";
import { API_URL } from "../../utils/constants.js";
import { toast } from "sonner";
import {UserContext} from "../../contexts/UserContext.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../../utils/queryKeys.js";

export default function RecipeCard({ id, author, recipeName, createTimestamp, image, description }) {

    const queryClient = useQueryClient()
    const {user} = useContext(UserContext)

    // const [comments, setComments] = useState([])
    const [enteredComment, setEnteredComment] = useState("")
    const [expanded, setExpanded] = useState();

    const getComments = async () => {
        try {
            const response = await fetch(API_URL + "/recipes/comments?recipeId=" + id,

                {
                    method: "GET",
                    credentials: "include"
                }
            )
            const data = await response.json()
            return data
            // console.log(data)
            // setComments(data)
        } catch (e) {
            toast.error("Something went wrong when trying to comment.")
            console.log(e)
        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const submitComment = async () => {
        return fetch(API_URL+"/recipes/comments",
            {
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    userId:user.id,
                    recipeId:id,
                    comment:enteredComment
                })
            }
        )
    }

    const commentMutation = useMutation({
        mutationFn:submitComment,
        onSuccess:()=>{
            queryClient.invalidateQueries(queryKeys.recipes.comments(id))
        },
        onSettled:()=>{
            setEnteredComment("")
        }
    })

    const onCommentSubmit = (e) => {
        e.preventDefault()
        commentMutation.mutate()
    }

    const {data: comments, isLoading} = useQuery({
        queryKey: queryKeys.recipes.comments(id),
        queryFn: getComments
    })

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
                {/*<Divider />*/}
                <Typography sx={{ color: "text.secondary", fontSize: ".95rem" }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{mt:"-16px"}}disableSpacing>
                {
                    !isLoading && comments && comments.length > 0 &&
                    <Button
                        onClick={handleExpandClick}
                        sx={{color:"text.secondary", fontSize:".9rem",textTransform:"none"}}
                    >
                        {
                            comments.length === 1 ?
                                `View ${ comments.length} comment...`
                            :
                            `View all ${ comments.length} comments...`
                        }

                    </Button>
                }

            </CardActions>
            <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                <CardContent>
                    {!isLoading && comments &&
                        <Stack sx={{mt:"-8px"}} spacing={2}>

                            {comments.length === 0 && <Typography>No comments found.</Typography>}
                            {comments.length > 0 &&
                                comments.map((commentDTO,i)=>{
                                    return (
                                            <Stack key={i} direction={"row"} spacing={1.5}>
                                                <Avatar>D</Avatar>
                                                <Stack>

                                                        <Typography sx={{fontSize:"1.05rem",fontWeight:"bold"}}>{commentDTO.commenter}</Typography>
                                                        <Typography >{commentDTO.comment}</Typography>
                                                </Stack>
                                            </Stack>
                                    )
                                })
                            }


                        </Stack>
                    }
                </CardContent>
            </Collapse>
            <form onSubmit={onCommentSubmit}>
                <CardActions sx={{pl:"16px",marginTop:-2}}>

                    <Stack direction={"row"} spacing={1} width={"100%"}>
                            <TextField
                                variant="standard"
                                sx={{
                                    input: {
                                        fontSize:".9rem"
                                    }
                                }}
                                slotProps={{
                                    input:{
                                        disableUnderline:true
                                    }
                                }}
                                fullWidth
                                placeholder={"Type a comment..."}
                                value={enteredComment}
                                onChange={(e)=>setEnteredComment(e.target.value)}
                            />

                            {
                                enteredComment &&

                                <IconButton
                                    type={"submit"}
                                    sx={{p:0,pr:"8px"}}><ArrowUpwardIcon /></IconButton>
                            }

                    </Stack>
                </CardActions>
            </form>
        </Card>
    )
}
