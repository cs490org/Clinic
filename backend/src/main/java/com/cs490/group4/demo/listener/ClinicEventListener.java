package com.cs490.group4.demo.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ClinicEventListener {

    @RabbitListener(queues = "prescription.fulfilled")
    public void handleMessage(String message) {
        // TODO: Implement your event handling logic here
        System.out.println("Received message: " + message);
    }
} 