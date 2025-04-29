package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class DailySurvey {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    private Integer caloriesEaten;

    // 1 to 10
    private Integer mood;

    // Separate from createTimestamp so we can insert mock data.
    private LocalDate surveyDate;

    @CreationTimestamp
    private LocalDateTime createTimestamp;

    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

}