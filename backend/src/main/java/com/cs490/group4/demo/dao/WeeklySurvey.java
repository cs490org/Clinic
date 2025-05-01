package com.cs490.group4.demo.dao;

import com.google.type.DateTime;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class WeeklySurvey {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    private Float weight;


    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate surveyDate;


    @CreationTimestamp
    private LocalDateTime createTimestamp;

    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

}