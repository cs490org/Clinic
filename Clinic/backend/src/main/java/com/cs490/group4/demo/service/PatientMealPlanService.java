package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.MealPlanResponseDTO;
import com.cs490.group4.demo.security.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientMealPlanService {

    private final PatientMealPlanRepository patientMealPlanRepository;
    private final PatientRepository patientRepository;
    private final MealPlanRepository mealPlanRepository;
    private final MealPlanOwnerRepository mealPlanOwnerRepository;

    public PatientMealPlanService(PatientMealPlanRepository patientMealPlanRepository, PatientRepository patientRepository, MealPlanRepository mealPlanRepository, MealPlanOwnerRepository mealPlanOwnerRepository) {
        this.patientMealPlanRepository = patientMealPlanRepository;
        this.patientRepository = patientRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.mealPlanOwnerRepository = mealPlanOwnerRepository;
    }

    @Transactional
    public List<MealPlanResponseDTO> getPatientAssignedMealPlans(Integer patientId) {
        return patientMealPlanRepository.findByPatientId(patientId)
                .stream()
                .map((patientMealPlan) -> {
                    MealPlanResponseDTO mealPlanResponseDTO = new MealPlanResponseDTO();
                    mealPlanResponseDTO.setMealPlan(patientMealPlan.getMealPlan());
                    User author = mealPlanOwnerRepository.findByMealPlanId(patientMealPlan.getMealPlan().getId()).getUser();
                    mealPlanResponseDTO.setAuthor(author);
                    return mealPlanResponseDTO;
                    })
                .toList();
    }

}
