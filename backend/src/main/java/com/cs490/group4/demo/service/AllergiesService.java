package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AllergiesService {

    private final AllergiesRepository allergiesRepository;
    private final PatientRepository patientRepository;
    private final IngredientRepository ingredientRepository;

    public List<Allergies> getAllergiesByPatientId(Integer patientId) {
        return allergiesRepository.findByPatientId(patientId);
    }

    public Allergies addAllergy(Integer patientId, List<Integer> ingredientIds) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<Ingredient> ingredients = ingredientRepository.findAllById(ingredientIds);

        Allergies allergy = new Allergies();
        allergy.setPatient(patient);
        allergy.setIngredient(ingredients);

        return allergiesRepository.save(allergy);
    }
}
