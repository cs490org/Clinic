package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Prescription {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "drug_id", referencedColumnName = "id")
    private Drug drug;

    @OneToOne
    @JoinColumn(name = "rx_status_code", referencedColumnName = "id")
    private RxStatusCode rxStatusCode;

    private LocalDateTime rxExpiryTimestamp;

}