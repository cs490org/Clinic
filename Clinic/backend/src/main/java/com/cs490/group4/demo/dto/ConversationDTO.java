package com.cs490.group4.demo.dto;

import com.cs490.group4.demo.dao.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {

    Integer appointmentId;
    List<Message> messages;

}
