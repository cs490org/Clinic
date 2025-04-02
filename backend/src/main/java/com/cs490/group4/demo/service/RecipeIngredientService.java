package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeIngredientService {

    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    @Transactional
    public List<Ingredient> addIngredientsToRecipe(Integer recipeId, List<Integer> ingredientIds) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(()->new EntityNotFoundException("Recipe not found"));
        List<Ingredient> ingredients =  new ArrayList<>();

        for (Integer ingredientId : ingredientIds) {
            Ingredient ingredient = ingredientRepository.findById(ingredientId).orElseThrow(()->new EntityNotFoundException("Ingredient not found"));
            ingredients.add(ingredient);
        }

        for (Ingredient ingredient : ingredients) {
            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setRecipe(recipe);
            recipeIngredient.setIngredient(ingredient);
            recipeIngredientRepository.save(recipeIngredient);
        }

        return ingredients;
    }

    public List<Ingredient> getIngredientsFromRecipeId(Integer recipeId) {
        List<RecipeIngredient> recipeIngredients = recipeIngredientRepository.findAllByRecipeId(recipeId);
        List<Ingredient> ingredients = new ArrayList<>();

        for (RecipeIngredient recipeIngredient : recipeIngredients) {
            Ingredient ingredient = recipeIngredient.getIngredient();
            ingredients.add(ingredient);
        }

        return ingredients;
    }

    public boolean isEmpty(){
        return recipeIngredientRepository.count() == 0;
    }
}



