package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientMealPlanService {

    private final PatientMealPlanRepository patientMealPlanRepository;
    private final PatientRepository patientRepository;
    private final MealPlanRepository mealPlanRepository;

    public PatientMealPlanService(PatientMealPlanRepository patientMealPlanRepository, PatientRepository patientRepository, MealPlanRepository mealPlanRepository) {
        this.patientMealPlanRepository = patientMealPlanRepository;
        this.patientRepository = patientRepository;
        this.mealPlanRepository = mealPlanRepository;
    }

    public List<MealPlan> getPatientAssignedMealPlans(Integer patientId) {
        return patientMealPlanRepository.findByPatientId(patientId)
                .stream()
                .map((patientMealPlan) -> patientMealPlan.getMealPlan())
                .toList();
    }

}
