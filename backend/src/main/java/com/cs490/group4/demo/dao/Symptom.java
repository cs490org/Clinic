package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Symptom {
    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    @Enumerated(EnumType.STRING)
    private SymptomType symptomType;
}
