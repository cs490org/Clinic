package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class MealPlan {

    @Id
    @GeneratedValue
    private Integer id;

    private String imageUri;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private Recipe breakfast, lunch, dinner;

    @CreationTimestamp
    private LocalDateTime createTimestamp;

    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

}