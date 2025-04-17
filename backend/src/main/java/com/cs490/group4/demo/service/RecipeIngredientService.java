package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.dto.IngredientResponseDTO;
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
    public List<IngredientResponseDTO> addIngredientsToRecipe(Integer recipeId, List<IngredientRequestDTO> ingredientRequestDTOS) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(()->new EntityNotFoundException("Recipe not found"));

        for (IngredientRequestDTO ingredientRequestDTO : ingredientRequestDTOS) {
            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setRecipe(recipe);

            Ingredient ingredient = ingredientRepository.findById(ingredientRequestDTO.getIngredientId()).orElseThrow(()->new EntityNotFoundException("Ingredient not found"));
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setQuantity(ingredientRequestDTO.getQuantity());

            recipeIngredientRepository.save(recipeIngredient);
        }

        ArrayList<IngredientResponseDTO> ingredientResponseDTOS = new ArrayList<>();
        for (IngredientRequestDTO ingredientRequestDTO : ingredientRequestDTOS) {
            IngredientResponseDTO ingredientResponseDTO = new IngredientResponseDTO();
            ingredientResponseDTO.setQuantity(ingredientRequestDTO.getQuantity());
            ingredientResponseDTO.setIngredient(ingredientRepository.findById(ingredientRequestDTO.getIngredientId()).orElseThrow());
            ingredientResponseDTOS.add(ingredientResponseDTO);
        }
        return ingredientResponseDTOS;
    }


    // for a recipe, get ingredient dtos which contain list of ingredients with their respective amounts.
    public List<IngredientResponseDTO> getIngredientDTOsFromRecipeId(Integer recipeId) {
        List<RecipeIngredient> recipeIngredients = recipeIngredientRepository.findAllByRecipeId(recipeId);
        List<IngredientResponseDTO> ingredientResponseDTOS = new ArrayList<>();

        for (RecipeIngredient recipeIngredient : recipeIngredients) {
            IngredientResponseDTO ingredientResponseDTO = new IngredientResponseDTO();
            Ingredient ingredient = recipeIngredient.getIngredient();
            Integer quantity = recipeIngredient.getQuantity();

            ingredientResponseDTO.setIngredient(ingredient);
            ingredientResponseDTO.setQuantity(quantity);
            ingredientResponseDTOS.add(ingredientResponseDTO);
        }

        return ingredientResponseDTOS;
    }

    public boolean isEmpty(){
        return recipeIngredientRepository.count() == 0;
    }
}



