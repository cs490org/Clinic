package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Doctor {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    private String firstName, lastName, email, phone, specialty, licenseNumber;

    private LocalDateTime createTimestamp, updateTimestamp;

}