package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AllergiesService {

    private final AllergyRepository allergiesRepository;
    private final PatientRepository patientRepository;
    private final IngredientRepository ingredientRepository;
    private final AllergyRepository allergyRepository;

    public List<Allergy> getAllergiesByPatientId(Integer patientId) {
        return allergiesRepository.findByPatientId(patientId);
    }

    @Transactional
    public List<Allergy> setAllergies(Integer patientId, List<Integer> ingredientIds) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(
                () -> new RuntimeException("Patient not found")
        );

        // delete existing
        List<Allergy> existing = allergiesRepository.findByPatientId(patientId);
        allergiesRepository.deleteAll(existing);

        // create new allergies
        List<Ingredient> ingredients = ingredientRepository.findAllById(ingredientIds);
        List<Allergy> savedAllergies = new ArrayList<>();

        for (Ingredient ingredient : ingredients) {
            Allergy allergy = new Allergy();
            allergy.setIngredient(ingredient);
            allergy.setPatient(patient);
            savedAllergies.add(allergyRepository.save(allergy));
        }
        return savedAllergies;
    }

}
