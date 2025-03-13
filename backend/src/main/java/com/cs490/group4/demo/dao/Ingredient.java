package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Ingredient {

    @Id
    @GeneratedValue
    private Integer id;

    private Integer calories, carbs, fats, protein;

    private String name, description;

    private LocalDateTime createTimestamp, updateTimestamp;

}