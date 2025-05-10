package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.MealPlan;
import com.cs490.group4.demo.dto.MealPlanCreateRequestDTO;
import com.cs490.group4.demo.service.MealPlanService;
import org.springframework.stereotype.Component;

@Component
public class MockMealPlan {

    private final MealPlanService mealPlanService;

    public MockMealPlan(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    public MealPlan createMockMealPlan(String name,Integer authorId, Integer breakfastId, Integer lunchId, Integer dinnerId) {
        MealPlanCreateRequestDTO mealPlanCreateRequestDTO = new MealPlanCreateRequestDTO();
        mealPlanCreateRequestDTO.setName(name);
        mealPlanCreateRequestDTO.setAuthorId(authorId);

        mealPlanCreateRequestDTO.setBreakfastId(breakfastId);
        mealPlanCreateRequestDTO.setLunchId(lunchId);
        mealPlanCreateRequestDTO.setDinnerId(dinnerId);
        return mealPlanService.createMealPlan(mealPlanCreateRequestDTO);

    }
}
