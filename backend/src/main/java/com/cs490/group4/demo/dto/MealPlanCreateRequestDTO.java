package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class MealPlanCreateRequestDTO {
    private Integer authorId;
    //recipes
    private Integer breakfastId;
    private Integer lunchId;
    private Integer dinnerId;
}
