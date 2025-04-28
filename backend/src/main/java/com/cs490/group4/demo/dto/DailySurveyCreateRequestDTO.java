package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class DailySurveyCreateRequestDTO {

    private Integer patientId;
    private Integer caloriesEaten;
    private Integer mood;
}
