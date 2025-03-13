package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AppointmentStatusCode {

    @Id
    @GeneratedValue
    private Integer id;

    private String status;

    private LocalDateTime createTimestamp, updateTimestamp;
    
    

}