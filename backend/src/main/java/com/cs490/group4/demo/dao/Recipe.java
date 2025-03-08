package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Recipe {

    @Id
    @GeneratedValue
    private Integer id;

    private String name, description;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User author;

    private LocalDateTime createTimestamp, updateTimestamp;

}