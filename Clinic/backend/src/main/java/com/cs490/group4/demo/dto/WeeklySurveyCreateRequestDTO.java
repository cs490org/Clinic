package com.cs490.group4.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WeeklySurveyCreateRequestDTO {
    private Integer patientId;
    private Float weight;

    private LocalDate surveyDate;
}
