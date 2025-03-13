package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Data
public class Doctor {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    private String firstName, lastName, email, phone, specialty;
    private Long licenseNumber;

    private LocalDateTime createTimestamp, updateTimestamp;

}