package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

@Entity
public class PatientChart {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    private Integer age;

    private Float weight, height;

    private String sex;

}