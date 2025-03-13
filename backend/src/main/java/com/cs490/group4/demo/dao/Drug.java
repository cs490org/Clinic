package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Drug {

    @Id
    @GeneratedValue
    private Integer id;
    private String name, description, dosage;

    private BigDecimal price;

    private LocalDateTime createTimestamp, updateTimestamp;

}