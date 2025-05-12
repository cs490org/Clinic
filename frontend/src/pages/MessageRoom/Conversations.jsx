import React, { useContext, useState } from 'react';
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Paper,
    Divider,
    Modal,
    IconButton
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';

const MessageHistoryModal = ({ open, onClose, appointmentId, otherUser }) => {
    const { user } = useContext(UserContext);
    const { data: messages, isLoading } = useQuery({
        queryKey: ['messages', appointmentId],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/messages/appointment/${appointmentId}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            return response.json();
        },
        enabled: open && !!appointmentId
    });

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="message-history-modal"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 800,
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    p: 2,
                    borderBottom: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={otherUser?.imgUri}>
                            {otherUser?.firstName?.[0]}
                        </Avatar>
                        <Typography variant="h6">
                            {otherUser?.firstName} {otherUser?.lastName}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {isLoading ? (
                        <Typography>Loading messages...</Typography>
                    ) : (
                        messages?.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.fromUserId.userId === user?.id ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        bgcolor: message.fromUserId.userId === user?.id ? 'primary.main' : 'grey.100',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: message.fromUserId.userId === user?.id ? 'white' : 'black',
                                        }}
                                    >
                                        {message.message}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mt: 1,
                                            color: message.fromUserId.userId === user?.id ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                                        }}
                                    >
                                        {format(new Date(message.sentTimestamp), 'MMM d, yyyy h:mm a')}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default function Conversations() {
    const { user } = useContext(UserContext);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations', user?.id],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/messages/conversations?userId=${user?.id}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch conversations');
            return response.json();
        },
        enabled: !!user?.id
    });

    const handleConversationClick = (appointmentId, otherUser) => {
        setSelectedConversation({ appointmentId, otherUser });
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography>Loading conversations...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3}>
                <Box sx={{ p: 2, borderBottom: 1 }}>
                    <Typography variant="h5">Appointment Chat History</Typography>
                </Box>
                <List>
                    {conversations?.reverse().map((conversation, index) => {
                        const lastMessage = conversation.messages[0]; // First message in the list is the most recent
                        const otherUser = lastMessage.fromUserId.userId === user?.id 
                            ? lastMessage.toUserId 
                            : lastMessage.fromUserId;

                        return (
                            <React.Fragment key={conversation.appointmentId}>
                                <ListItem 
                                    button 
                                    onClick={() => handleConversationClick(
                                        conversation.appointmentId,
                                        otherUser
                                    )}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': { 
                                            backgroundColor: 'action.hover' 
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={otherUser.imgUri}>
                                            {otherUser.firstName?.[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${otherUser.firstName} ${otherUser.lastName}`}
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{ display: 'block' }}
                                                >
                                                    {lastMessage.message}
                                                </Typography>
                                                {format(new Date(lastMessage.sentTimestamp), 'MMM d, yyyy h:mm a')}
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < conversations.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </List>
            </Paper>

            <MessageHistoryModal
                open={!!selectedConversation}
                onClose={() => setSelectedConversation(null)}
                appointmentId={selectedConversation?.appointmentId}
                otherUser={selectedConversation?.otherUser}
            />
        </Container>
    );
}