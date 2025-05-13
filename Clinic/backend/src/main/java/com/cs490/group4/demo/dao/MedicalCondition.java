package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class MedicalCondition {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_chart_id", referencedColumnName = "id")
    private PatientChart patientChart;

    private String name, description;

    private LocalDateTime createTimestamp, updateTimestamp;

}