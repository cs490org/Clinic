package com.cs490.group4.demo.dto;

import com.cs490.group4.demo.dao.MealPlan;
import com.cs490.group4.demo.security.User;
import lombok.Data;

@Data
public class MealPlanResponseDTO{
    private User author;
    private MealPlan mealPlan;
}
