package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteFoodService {

    private final FavoriteFoodRepository favoriteFoodRepository;
    private final PatientRepository patientRepository;
    private final IngredientRepository ingredientRepository;

    public FavoriteFood getFavoriteFoodByPatientId(Integer patientId) {
        return favoriteFoodRepository.getFavoriteFoodByPatientId(patientId);
    }

    public FavoriteFood setFavoriteFoodByPatientId(Integer patientId, Integer ingredientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(
                () -> new RuntimeException("Patient not found")
        );
        Ingredient ingredient = ingredientRepository.findById(ingredientId).orElseThrow(
                () -> new RuntimeException("Ingredient not found")
        );
        FavoriteFood favoriteFood = new FavoriteFood();
        favoriteFood.setPatient(patient);
        favoriteFood.setIngredient(ingredient);
        return favoriteFoodRepository.save(favoriteFood);

    }
}
