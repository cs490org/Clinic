package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.math.BigDecimal;

@Entity
public class Drug {

    @Id
    @GeneratedValue
    private Integer id;
    private String name, description, dosage;

    private BigDecimal price;

}