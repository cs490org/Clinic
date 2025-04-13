package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Ingredient;
import com.cs490.group4.demo.dao.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredientRepository;

    public List<Ingredient> getIngredients() {
        return ingredientRepository.findAll();
    }

    public Ingredient createIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    public boolean isEmpty(){
        return ingredientRepository.count() == 0;
    }

}


