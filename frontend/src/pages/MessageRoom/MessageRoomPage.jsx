import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Container,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import { format } from 'date-fns';
import { API_URL } from '../../utils/constants';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

export default function MessageRoomPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // const [toUserId, setToUserId] = useState(2); // This should be passed as a prop or from route params
    // const [searchParams] = useSearchParams()
    // const toUserId = searchParams.get("toUserId")

    const { toUserId } = useParams();

    const messagesEndRef = useRef(null);
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_URL}/messages/appointment/${id}`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            setMessages([...data.reverse()]);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // fromUserId, Being set based on AuthenticationPrincipal
                    toUserId,
                    message: newMessage,
                    appointmentId: id,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    console.log(user)
    console.log(messages)

    return (
        <Container maxWidth="md" sx={{ height: '90vh', py: 4 }}>
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ p: 2, borderBottom: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    Chat Room

                    {user?.role === "DOCTOR" ? <Button variant="contained" color="error" onClick={() => {
                        axios.patch(`${API_URL}/appointments/${id}/end`, { withCredentials: true })
                            .then(() => {
                                toast.success('Appointment ended successfully');
                                window.location.reload();
                            })
                    }}>
                        End Appointment
                    </Button> :
                        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                            Leave Appointment
                        </Button>}
                </Typography>

                <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {messages.map((message) => (
                        <React.Fragment key={message.id}>
                            <ListItem
                                sx={{
                                    justifyContent: message.fromUserId.userId === user?.id ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                {message.fromUserId.userId !== user?.id && <ListItemAvatar>
                                    <Avatar src={message.fromUserId.imgUri} />
                                </ListItemAvatar>}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        bgcolor: message.fromUserId.userId === user?.id ? 'primary.main' : 'grey.100',
                                        borderRadius: 2,
                                        ml: message.fromUserId.userId === user?.id ? 2 : 0,
                                        mr: message.fromUserId.userId === user?.id ? 0 : 2
                                    }}
                                >
                                    <ListItemText
                                        primary={message.message}
                                        secondary={format(new Date(message.sentTimestamp), 'MMM d, yyyy h:mm a')}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                color: message.fromUserId.userId === user?.id ? 'white' : 'text.primary',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: message.fromUserId.userId === user?.id ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                                            },
                                        }}
                                    />
                                </Paper>
                            </ListItem>
                        </React.Fragment>
                    ))}
                    <div ref={messagesEndRef} />
                </List>

                <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            size="small"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!newMessage.trim()}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
