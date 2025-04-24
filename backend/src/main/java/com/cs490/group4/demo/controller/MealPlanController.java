package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.MealPlan;
import com.cs490.group4.demo.dto.MealPlanCreateRequest;
import com.cs490.group4.demo.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("mealplans")
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @GetMapping
    private ResponseEntity<?> getMealPlans(){
        return ResponseEntity.ok(mealPlanService.findAll());
    }

    @PostMapping
    private ResponseEntity<?> createMealPlan(@RequestBody MealPlanCreateRequest mealPlanCreateRequest){
        return ResponseEntity.ok(mealPlanService.createMealPlan(mealPlanCreateRequest));
    }
}
