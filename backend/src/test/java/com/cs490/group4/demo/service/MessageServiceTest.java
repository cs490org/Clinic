package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.MessageDTO;
import com.cs490.group4.demo.dao.MessageRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.authentication.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MessageServiceTest {

    @Mock private MessageRepository messageRepository;
    @Mock private UserService userService;
    @Mock private AppointmentRepository appointmentRepository;
    @InjectMocks private MessageService messageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendMessage_withAppointment_success() {
        MessageDTO dto = new MessageDTO();
        dto.setMessage("Hello");
        dto.setAppointmentId(1);
        dto.setFromUserId(2);
        dto.setToUserId(3);

        Appointment appt = new Appointment();
        User fromUser = new User(); fromUser.setUserId(2);
        User toUser = new User(); toUser.setUserId(3);

        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appt));
        when(userService.getUserById(2)).thenReturn(fromUser);
        when(userService.getUserById(3)).thenReturn(toUser);
        when(messageRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Message result = messageService.sendMessage(dto);

        assertEquals("Hello", result.getMessage());
        assertEquals(appt, result.getAppointment());
        assertEquals(2, result.getFromUserId().getUserId());
        assertEquals(3, result.getToUserId().getUserId());
    }

    @Test
    void sendMessage_withoutAppointment_success() {
        MessageDTO dto = new MessageDTO();
        dto.setMessage("No appointment");
        dto.setFromUserId(2);
        dto.setToUserId(3);

        User fromUser = new User(); fromUser.setUserId(2);
        User toUser = new User(); toUser.setUserId(3);

        when(userService.getUserById(2)).thenReturn(fromUser);
        when(userService.getUserById(3)).thenReturn(toUser);
        when(messageRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Message result = messageService.sendMessage(dto);

        assertEquals("No appointment", result.getMessage());
        assertNull(result.getAppointment());
    }

    @Test
    void sendMessage_invalidAppointment_throws() {
        MessageDTO dto = new MessageDTO();
        dto.setAppointmentId(10);
        dto.setFromUserId(1);
        dto.setToUserId(2);

        when(appointmentRepository.findById(10)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> messageService.sendMessage(dto));
    }

    @Test
    void markAsReceived_success() {
        Message msg = new Message();
        msg.setId(1);
        when(messageRepository.findById(1)).thenReturn(Optional.of(msg));
        when(messageRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Message result = messageService.markAsReceived(1);

        assertNotNull(result.getReceivedTimestamp());
        assertNotNull(result.getUpdateTimestamp());
        verify(messageRepository).save(msg);
    }

    @Test
    void markAsReceived_notFound_throws() {
        when(messageRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> messageService.markAsReceived(99));
    }

//    @Test
    void getMessagesByAppointment_returnsMessages() {
        List<Message> messages = List.of(new Message(), new Message());
        when(messageRepository.findByAppointmentIdOrderBySentTimestampDesc(5)).thenReturn(messages);

        List<Message> result = messageService.getMessagesByAppointment(5);

        assertEquals(2, result.size());
    }
}
