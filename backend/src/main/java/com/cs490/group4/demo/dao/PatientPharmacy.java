package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class PatientPharmacy {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "pharmacy_id", referencedColumnName = "id")
    private Pharmacy pharmacy;

    private LocalDateTime createTimestamp, updateTimestamp;

}