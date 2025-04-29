package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Appointment;
import com.cs490.group4.demo.dao.Message;
import com.cs490.group4.demo.dto.MessageDTO;
import com.cs490.group4.demo.repository.MessageRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.authentication.UserService;
import com.cs490.group4.demo.dao.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private AppointmentRepository appointmentRepository;

    public Message sendMessage(MessageDTO dto) {
        Appointment appointment = null;
        if (dto.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + dto.getAppointmentId()));
        }
        
        Message message = Message.builder()
                .message(dto.getMessage())
                .createTimestamp(LocalDateTime.now())
                .receivedTimestamp(LocalDateTime.now())
                .sentTimestamp(LocalDateTime.now())
                .updateTimestamp(LocalDateTime.now())
                .appointment(appointment)
                .fromUserId(userService.getUserById(dto.getFromUserId()))
                .toUserId(userService.getUserById(dto.getToUserId()))
                .build();

        return messageRepository.save(message);
    }

    public Message markAsReceived(Integer messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setReceivedTimestamp(LocalDateTime.now());
        message.setUpdateTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByAppointment(Integer appointmentId) {
        return messageRepository.findByAppointmentIdOrderBySentTimestampDesc(appointmentId);
    }
} 