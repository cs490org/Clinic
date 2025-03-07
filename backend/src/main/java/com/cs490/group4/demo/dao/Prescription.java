package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

@Entity
public class Prescription {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToMany
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private Doctor doctor;

    @ManyToMany
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToMany
    @JoinColumn(name = "drug_id", referencedColumnName = "id")
    private Drug drug;

}