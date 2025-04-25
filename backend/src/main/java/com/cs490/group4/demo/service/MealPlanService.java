package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.MealPlanCreateRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final PatientRepository patientRepository;
    private final RecipeRepository recipeRepository;

    public List<MealPlan> findAll() {
        return mealPlanRepository.findAll();
    }
    public List<MealPlan> findByPatientId(Integer patientId) {
        return mealPlanRepository.findByPatientId(patientId);
    }
    @Transactional
    public MealPlan createMealPlan(MealPlanCreateRequestDTO mealPlanDTO) {
        Patient patient = patientRepository.findById(mealPlanDTO.getPatientId()).orElseThrow(
                ()->new EntityNotFoundException("Patient not found"));
        Recipe breakfast = recipeRepository.findById(mealPlanDTO.getBreakfastId()).orElseThrow(
                ()->new EntityNotFoundException("Recipe not found"));
        Recipe lunch = recipeRepository.findById(mealPlanDTO.getLunchId()).orElseThrow(
                ()->new EntityNotFoundException("Recipe not found"));
        Recipe dinner = recipeRepository.findById(mealPlanDTO.getDinnerId()).orElseThrow(
                ()->new EntityNotFoundException("Recipe not found"));

        MealPlan mealPlan = new MealPlan();
        mealPlan.setPatient(patient);
        mealPlan.setBreakfast(breakfast);
        mealPlan.setLunch(lunch);
        mealPlan.setDinner(dinner);
        return mealPlanRepository.save(mealPlan);
    }
}
