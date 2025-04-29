import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import { format } from 'date-fns';
import { API_URL } from '../../utils/constants';
import { useSearchParams } from 'react-router-dom';

export default function MessageRoomPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [fromUserId, setFromUserId] = useState(1); // This should come from your auth context
    const [toUserId, setToUserId] = useState(2); // This should be passed as a prop or from route params
    const messagesEndRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
        return () => clearInterval(interval);
    }, [fromUserId, toUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_URL}/messages/appointment/${appointmentId}`, {
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
                    fromUserId,
                    toUserId,
                    message: newMessage,
                    appointmentId,
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

    return (
        <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ p: 2, borderBottom: 1 }}>
                    Chat Room
                </Typography>

                <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {messages.map((message) => (
                        <React.Fragment key={message.id}>
                            <ListItem
                                sx={{
                                    justifyContent: message.fromUserId === fromUserId ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        bgcolor: message.fromUserId === fromUserId ? 'primary.main' : 'grey.100',
                                        borderRadius: 2,
                                        ml: message.fromUserId === fromUserId ? 2 : 0,
                                        mr: message.fromUserId === fromUserId ? 0 : 2
                                    }}
                                >
                                    <ListItemText
                                        primary={message.message}
                                        secondary={format(new Date(message.sentTimestamp), 'MMM d, yyyy h:mm a')}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                color: message.fromUserId === fromUserId ? 'white' : 'text.primary',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: message.fromUserId === fromUserId ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
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
