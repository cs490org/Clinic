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
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from '@mui/material';
import { format } from 'date-fns';
import { API_URL } from '../../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import PatientAddAppointmentData from "../Patient/PatientAddAppointmentData.jsx";
import {useQuery} from "@tanstack/react-query";
import AssignRx from '../Doctor/AssignRx';
import AssignMealPlan from '../Doctor/AssignMealPlan';

export default function MessageRoomPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEndAppointmentModal, setShowEndAppointmentModal] = useState(false);
    const [showRxForm, setShowRxForm] = useState(false);
    const [showMealPlanForm, setShowMealPlanForm] = useState(false);

    // patient submitting their metrics for the appointment
    const [showForm, setShowForm] = useState(false);
    const [hasSubmittedData, setHasSubmittedData] = useState(false);

    const { user ,roleData} = useContext(UserContext);

    const { toUserId } = useParams();
    const { id } = useParams(); // appointment ID

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const theme = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const checkAppointmentStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/appointments/${id}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch appointment status');
            const appointment = await response.json();

            if (appointment[0].appointmentStatusCode?.id === 4 && user?.role === 'PATIENT') {
                navigate(`/appointment/${id}/complete`);
            }

            if (appointment[0].appointmentStatusCode?.id === 3) {
                navigate(-1);
                toast("The patient has cancelled the appointment.");
            }
        } catch (error) {
            console.error('Error checking appointment status:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        checkAppointmentStatus();

        const messageInterval = setInterval(fetchMessages, 5000);
        const statusInterval = setInterval(checkAppointmentStatus, 5000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(statusInterval);
        };
    }, [user, id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkIfAppointmentDataSubmitted = async () => {
        try {
            const url =`${API_URL}/patient/${roleData.id}/appointment-data/${id}`
            console.log(url)
            const res = await axios.get(url, {
                withCredentials: true
            });
            if (res.data) {
                setHasSubmittedData(true);
            } else {
                setShowForm(true); // no data submitted → show modal
            }
        } catch (err) {
            console.error('Error checking appointment data:', err);
            setShowForm(true); // show anyway if check fails
        }
    };

    useEffect(() => {
        if (user?.role === 'PATIENT') {
            checkIfAppointmentDataSubmitted();
        }
    }, [user, id]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_URL}/messages/appointment/${id}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages([...data]);
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
                    toUserId,
                    message: newMessage,
                    appointmentId: id,
                }),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to send message');

            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleEndAppointment = async () => {
        try {
            await axios.post(`${API_URL}/appointments/${id}/complete`, null, {
                withCredentials: true
            });
            toast.success("Appointment ended successfully");
            setShowEndAppointmentModal(false);
            navigate('/doctor/dashboard');
        } catch (error) {
            console.error("Failed to complete appointment:", error);
            toast.error("Failed to end appointment");
        }
    };

    return (
        <>
        <Container maxWidth="md" sx={{ height: '90vh', py: 4 }}>
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h5"
                    sx={{
                        p: 2,
                        borderBottom: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    Chat Room

                    {user?.role === "DOCTOR" ? (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setShowEndAppointmentModal(true)}
                        >
                            End Appointment
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => navigate(-1)}
                        >
                            Leave Appointment
                        </Button>
                    )}
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
                                {message.fromUserId.userId !== user?.id && (
                                    <ListItemAvatar>
                                        <Avatar src={message.fromUserId.imgUri} />
                                    </ListItemAvatar>
                                )}
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
                                                color: message.fromUserId.userId === user?.id ? 'white' : 'black',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: message.fromUserId.userId === user?.id ? 'rgba(255, 255, 255, 0.7)' : 'black',
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

        {/* End Appointment Modal */}
        <Dialog 
            open={showEndAppointmentModal} 
            onClose={() => setShowEndAppointmentModal(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>End Appointment</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <Button 
                        variant="outlined" 
                        onClick={() => {
                            setShowRxForm(true);
                            setShowEndAppointmentModal(false);
                        }}
                    >
                        Assign Medication
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => {
                            setShowMealPlanForm(true);
                            setShowEndAppointmentModal(false);
                        }}
                    >
                        Assign Meal Plan
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowEndAppointmentModal(false)}>Cancel</Button>
                <Button onClick={handleEndAppointment} color="primary">
                    End Without Assigning
                </Button>
            </DialogActions>
        </Dialog>

        {/* Prescription Form */}
        {showRxForm && (
            <Dialog 
                open={showRxForm} 
                onClose={() => setShowRxForm(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <AssignRx toUserId={toUserId} />
                </DialogContent>
            </Dialog>
        )}

        {/* Meal Plan Form */}
        {showMealPlanForm && (
            <Dialog 
                open={showMealPlanForm} 
                onClose={() => setShowMealPlanForm(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <AssignMealPlan />
                </DialogContent>
            </Dialog>
        )}

        {showForm && user?.role === 'PATIENT' && (
            <PatientAddAppointmentData
                open={showForm}
                onClose={(success) => {
                    setShowForm(false);
                    if (success) {
                        toast.success("Appointment data submitted.");
                        setHasSubmittedData(true);
                    }
                }}
                appointmentId={id}
                patientId={roleData.id}
            />
        )}
        </>
    );
}
