package com.cs490.group4.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DailySurveyCreateRequestDTO {

    private Integer patientId;
    private Integer caloriesEaten;
    private Integer mood;

    private LocalDate surveyDate;
}
