package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.MealPlanAssignRequestDTO;
import com.cs490.group4.demo.dto.MealPlanCreateRequestDTO;
import com.cs490.group4.demo.dto.MealPlanResponseDTO;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final PatientRepository patientRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeService recipeService;
    private final PatientMealPlanRepository patientMealPlanRepository;
    private final UserRepository userRepository;
    private final MealPlanOwnerRepository mealPlanOwnerRepository;

    public List<MealPlanResponseDTO> findAll() {
        return mealPlanOwnerRepository.findAll().stream().map((mealPlanOwner)->{
            MealPlanResponseDTO mealPlanResponseDTO = new MealPlanResponseDTO();
            mealPlanResponseDTO.setAuthor(mealPlanOwner.getUser());
            mealPlanResponseDTO.setMealPlan(mealPlanOwner.getMealPlan());
            return mealPlanResponseDTO;
        }).collect(Collectors.toList());
    }
    @Transactional
    public MealPlan createMealPlan(MealPlanCreateRequestDTO mealPlanDTO) {
        User user = userRepository.findById(mealPlanDTO.getAuthorId()).orElseThrow(()->new EntityNotFoundException("User not found when creating MealPlan"));
        Recipe breakfast = recipeRepository.findById(mealPlanDTO.getBreakfastId()).orElseThrow(
                ()->new EntityNotFoundException("Recipe not found when creating MealPlan"));
        Recipe lunch = recipeRepository.findById(mealPlanDTO.getLunchId()).orElseThrow(
                ()->new EntityNotFoundException("Recipe not found when creating MealPlan"));
        Recipe dinner = recipeRepository.findById(mealPlanDTO.getDinnerId()).orElseThrow(
                ()->new EntityNotFoundException("Recipe not found when creating MealPlan"));

        MealPlan mealPlan = new MealPlan();
        mealPlan.setName(mealPlanDTO.getName());
        mealPlan.setBreakfast(breakfast);
        mealPlan.setLunch(lunch);
        mealPlan.setDinner(dinner);

        MealPlanOwner mealPlanOwner = new MealPlanOwner();
        mealPlanOwner.setUser(user);
        mealPlanOwner.setMealPlan(mealPlan);
        mealPlanOwnerRepository.save(mealPlanOwner);

        return mealPlanRepository.save(mealPlan);
    }
    @Transactional
    public PatientMealPlan assignMealPlan(MealPlanAssignRequestDTO assignDTO) {
        Patient patient = patientRepository.findById(assignDTO.getPatientId()).orElseThrow(
                ()->new EntityNotFoundException("Patient not found"));
        MealPlan mealPlan = mealPlanRepository.findById(assignDTO.getMealPlanId()).orElseThrow(
                ()->new EntityNotFoundException("MealPlan not found"));

        PatientMealPlan patientMealPlan = new PatientMealPlan();
        patientMealPlan.setPatient(patient);
        patientMealPlan.setMealPlan(mealPlan);
        return patientMealPlanRepository.save(patientMealPlan);
    }


    @Transactional
    public void deleteMealPlan(Integer mealPlanId) {
        // delete recipes in the meal plan
        MealPlan mealPlan = mealPlanRepository.findById(mealPlanId).orElseThrow(()->new EntityNotFoundException("MealPlan not found when trying to delete"));
//        Recipe breakfast= mealPlan.getBreakfast();
//        Recipe lunch= mealPlan.getLunch();
//        Recipe dinner= mealPlan.getDinner();
//        recipeService.deleteRecipe(breakfast.getId());
//        recipeService.deleteRecipe(lunch.getId());
//        recipeService.deleteRecipe(dinner.getId());

        // delete assigned meal plans
        List<PatientMealPlan> patientMealPlans = patientMealPlanRepository.findByMealPlanId(mealPlanId);
        patientMealPlanRepository.deleteAll(patientMealPlans);

        // delete meal plan owners
        mealPlanOwnerRepository.deleteAllByMealPlanId(mealPlanId);

        // delete meal plan
        mealPlanRepository.delete(mealPlan);
    }

}
