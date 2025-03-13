package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Patient {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    private String firstName, lastName, email, phone, address;

    private LocalDateTime createTimestamp, updateTimestamp;

}