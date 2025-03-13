package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Audit {

    @Id
    @GeneratedValue
    private Integer id;

    private String eventLog;

    private LocalDateTime createTimestamp, updateTimestamp;

}