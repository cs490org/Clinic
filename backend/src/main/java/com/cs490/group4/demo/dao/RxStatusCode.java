package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class RxStatusCode {

    @Id
    @GeneratedValue
    private Integer id;

    private String status;

    private LocalDateTime createTimestamp, updateTimestamp;
    

}