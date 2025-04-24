package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dto.MealPlanCreateRequestDTO;
import com.cs490.group4.demo.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mealplans")
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @GetMapping
    private ResponseEntity<?> getMealPlans(){
        return ResponseEntity.ok(mealPlanService.findAll());
    }

    @GetMapping("/patient/{id}")
    private ResponseEntity<?> getPatientMealPlans(@PathVariable Integer id){
        return ResponseEntity.ok(mealPlanService.findByPatientId(id));
    }

    @PostMapping
    private ResponseEntity<?> createMealPlan(@RequestBody MealPlanCreateRequestDTO mealPlanCreateRequestDTO){
        return ResponseEntity.ok(mealPlanService.createMealPlan(mealPlanCreateRequestDTO));
    }
}
