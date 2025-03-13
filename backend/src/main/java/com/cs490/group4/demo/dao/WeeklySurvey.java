package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class WeeklySurvey {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    private Float weight;

    private LocalDateTime createTimestamp, updateTimestamp;

}