package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PatientMealPlan {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "mealplan_id", referencedColumnName = "id")
    private MealPlan mealPlan;
}
