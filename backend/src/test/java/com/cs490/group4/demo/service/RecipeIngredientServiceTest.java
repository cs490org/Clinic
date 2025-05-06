package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.dto.IngredientResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeIngredientServiceTest {

    @Mock
    private RecipeIngredientRepository recipeIngredientRepository;

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private IngredientRepository ingredientRepository;

    @InjectMocks
    private RecipeIngredientService recipeIngredientService;

    @Test
    void addIngredientsToRecipe_successfullyAddsIngredients() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        Ingredient ingredient1 = new Ingredient();
        ingredient1.setId(1);
        ingredient1.setName("Salt");
        Ingredient ingredient2 = new Ingredient();
        ingredient2.setId(2);
        ingredient2.setName("Pepper");

        when(recipeRepository.findById(1)).thenReturn(Optional.of(recipe));
        when(ingredientRepository.findById(1)).thenReturn(Optional.of(ingredient1));
        when(ingredientRepository.findById(2)).thenReturn(Optional.of(ingredient2));

        IngredientRequestDTO request1 = new IngredientRequestDTO();
        request1.setIngredientId(1);
        request1.setQuantity(2);
        IngredientRequestDTO request2 = new IngredientRequestDTO();
        request2.setIngredientId(2);
        request2.setQuantity(1);

        List<IngredientRequestDTO> requests = Arrays.asList(request1, request2);

        List<IngredientResponseDTO> result = recipeIngredientService.addIngredientsToRecipe(1, requests);

        assertEquals(2, result.size());
        assertEquals(2, result.get(0).getQuantity());
        assertEquals(ingredient1, result.get(0).getIngredient());
        assertEquals(1, result.get(1).getQuantity());
        assertEquals(ingredient2, result.get(1).getIngredient());
        verify(recipeRepository).findById(1);
        verify(ingredientRepository, atLeastOnce()).findById(1);
        verify(ingredientRepository, atLeastOnce()).findById(2);
        verify(recipeIngredientRepository, times(2)).save(any(RecipeIngredient.class));
    }

    @Test
    void addIngredientsToRecipe_throwsIfRecipeNotFound() {
        when(recipeRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            recipeIngredientService.addIngredientsToRecipe(99, List.of(new IngredientRequestDTO()));
        });

        verify(recipeRepository).findById(99);
        verify(recipeIngredientRepository, never()).save(any(RecipeIngredient.class));
    }

    @Test
    void addIngredientsToRecipe_throwsIfIngredientNotFound() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        when(recipeRepository.findById(1)).thenReturn(Optional.of(recipe));
        when(ingredientRepository.findById(99)).thenReturn(Optional.empty());

        IngredientRequestDTO request = new IngredientRequestDTO();
        request.setIngredientId(99);
        request.setQuantity(1);

        assertThrows(EntityNotFoundException.class, () -> {
            recipeIngredientService.addIngredientsToRecipe(1, List.of(request));
        });

        verify(recipeRepository).findById(1);
        verify(ingredientRepository).findById(99);
        verify(recipeIngredientRepository, never()).save(any(RecipeIngredient.class));
    }

    @Test
    void getIngredientDTOsFromRecipeId_returnsAllIngredients() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        Ingredient ingredient1 = new Ingredient();
        ingredient1.setId(1);
        ingredient1.setName("Salt");
        Ingredient ingredient2 = new Ingredient();
        ingredient2.setId(2);
        ingredient2.setName("Pepper");

        RecipeIngredient recipeIngredient1 = new RecipeIngredient();
        recipeIngredient1.setRecipe(recipe);
        recipeIngredient1.setIngredient(ingredient1);
        recipeIngredient1.setQuantity(2);

        RecipeIngredient recipeIngredient2 = new RecipeIngredient();
        recipeIngredient2.setRecipe(recipe);
        recipeIngredient2.setIngredient(ingredient2);
        recipeIngredient2.setQuantity(1);

        List<RecipeIngredient> recipeIngredients = Arrays.asList(recipeIngredient1, recipeIngredient2);
        when(recipeIngredientRepository.findAllByRecipeId(1)).thenReturn(recipeIngredients);

        List<IngredientResponseDTO> result = recipeIngredientService.getIngredientDTOsFromRecipeId(1);

        assertEquals(2, result.size());
        assertEquals(2, result.get(0).getQuantity());
        assertEquals(ingredient1, result.get(0).getIngredient());
        assertEquals(1, result.get(1).getQuantity());
        assertEquals(ingredient2, result.get(1).getIngredient());
        verify(recipeIngredientRepository).findAllByRecipeId(1);
    }

    @Test
    void isEmpty_returnsTrue() {
        when(recipeIngredientRepository.count()).thenReturn(0L);
        assertTrue(recipeIngredientService.isEmpty());
        verify(recipeIngredientRepository).count();
    }

    @Test
    void isEmpty_returnsFalse() {
        when(recipeIngredientRepository.count()).thenReturn(1L);
        assertFalse(recipeIngredientService.isEmpty());
        verify(recipeIngredientRepository).count();
    }
} 