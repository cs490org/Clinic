package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class MealPlanCreateRequest {
    private Integer patientId;

//    private MultipartFile image;

    private Integer breakfastId;
    private Integer lunchId;
    private Integer dinnerId;
}
