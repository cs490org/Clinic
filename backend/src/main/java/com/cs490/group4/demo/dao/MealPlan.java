package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class MealPlan {

    @Id
    @GeneratedValue
    private Integer id;

    private String imageUri;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private Recipe breakfast, lunch, dinner;

    private LocalDateTime createTimestamp, updateTimestamp;

}