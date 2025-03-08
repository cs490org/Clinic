package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Pharmacy {

    @Id
    @GeneratedValue
    private Integer id;
    private String name, zipCode, phone, address;

}