package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class MealPlanAssignRequestDTO {
    private Integer patientId;
    private Integer mealPlanId;
}
