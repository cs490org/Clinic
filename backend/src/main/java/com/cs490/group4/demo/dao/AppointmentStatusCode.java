package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class AppointmentStatusCode {

    @Id
    @GeneratedValue
    private Integer id;

    private String status;
    
    

}