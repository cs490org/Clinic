package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

@Entity
public class MealPlan {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private Recipe breakfast, lunch, dinner;

}