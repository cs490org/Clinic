package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Message;
import com.cs490.group4.demo.dto.ConversationDTO;
import com.cs490.group4.demo.dto.MessageDTO;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.MessageService;
import com.cs490.group4.demo.service.authentication.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@AuthenticationPrincipal User user, @RequestBody MessageDTO messageDTO) {
        messageDTO.setFromUserId(user.getUserId());
        Message savedMessage = messageService.sendMessage(messageDTO);
        return ResponseEntity.ok(savedMessage);
    }

    @PutMapping("/{messageId}/received")
    public ResponseEntity<Message> markAsReceived(@PathVariable Integer messageId) {
        Message message = messageService.markAsReceived(messageId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Message>> getMessagesByAppointment(@PathVariable Integer appointmentId) {
        List<Message> messages = messageService.getMessagesByAppointment(appointmentId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(@RequestParam Integer userId) {
        List<ConversationDTO> conversations = messageService.getConversationsByUserId(userId);
        return ResponseEntity.ok(conversations);
    }
} 