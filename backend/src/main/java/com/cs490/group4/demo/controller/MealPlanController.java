package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.MealPlan;
import com.cs490.group4.demo.dao.PatientMealPlan;
import com.cs490.group4.demo.dto.MealPlanAssignRequestDTO;
import com.cs490.group4.demo.dto.MealPlanCreateRequestDTO;
import com.cs490.group4.demo.dto.MealPlanResponseDTO;
import com.cs490.group4.demo.service.MealPlanService;
import com.cs490.group4.demo.service.PatientMealPlanService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mealplans")
public class MealPlanController {

    private final MealPlanService mealPlanService;
    private final PatientMealPlanService patientMealPlanService;

    @GetMapping
    private ResponseEntity<?> getMealPlans(){
        return ResponseEntity.ok(mealPlanService.findAll());
    }

    @PostMapping
    private ResponseEntity<?> createMealPlan(@RequestBody MealPlanCreateRequestDTO mealPlanCreateRequestDTO){
        return ResponseEntity.ok(mealPlanService.createMealPlan(mealPlanCreateRequestDTO));
    }
    @DeleteMapping
    private ResponseEntity<?> deleteMealPlan(@RequestParam(required = true) Integer id){
        mealPlanService.deleteMealPlan(id);
        return ResponseEntity.ok().build();
    }



    @GetMapping("/patient/{id}")
    private ResponseEntity<List<MealPlanResponseDTO>> getPatientAssignedMealPlans(@PathVariable Integer id){
        return ResponseEntity.ok(patientMealPlanService.getPatientAssignedMealPlans(id));
    }
    @PostMapping("/patient")
    private ResponseEntity<PatientMealPlan> assignMealPlan(@RequestBody MealPlanAssignRequestDTO mealPlanAssignRequestDTO){
        return ResponseEntity.ok(mealPlanService.assignMealPlan(mealPlanAssignRequestDTO));
    }



}
