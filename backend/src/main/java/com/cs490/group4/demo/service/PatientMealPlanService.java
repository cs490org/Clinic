package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.MealPlan;
import com.cs490.group4.demo.dao.PatientMealPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientMealPlanService {

    private final PatientMealPlanRepository patientMealPlanRepository;

    public PatientMealPlanService(PatientMealPlanRepository patientMealPlanRepository) {
        this.patientMealPlanRepository = patientMealPlanRepository;
    }

    public List<MealPlan> getPatientAssignedMealPlans(Integer patientId) {
        return patientMealPlanRepository.findByPatientId(patientId)
                .stream()
                .map((patientMealPlan) -> patientMealPlan.getMealPlan())
                .toList();
    }
}
