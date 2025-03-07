package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

@Entity
public class PrescriptionPharmacyLink {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToMany
    @JoinColumn(name = "prescription_id", referencedColumnName = "id")
    private Prescription prescription;

    @ManyToMany
    @JoinColumn(name = "pharmacy_id", referencedColumnName = "id")
    private Pharmacy pharmacy;

}