package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class DoctorReviews {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    private String title, review;
    private Integer rating;

    private LocalDateTime createTimestamp, updateTimestamp;

}