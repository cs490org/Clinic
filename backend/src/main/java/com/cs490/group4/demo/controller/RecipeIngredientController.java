package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.RecipeIngredientService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes/ingredients")
@RequiredArgsConstructor
public class RecipeIngredientController {
    private final RecipeIngredientService recipeIngredientService;

    @GetMapping
    private ResponseEntity<?> getRecipeIngredients(@RequestParam(required = true) Integer recipeId){
        return ResponseEntity.ok(recipeIngredientService.getIngredientsFromRecipeId(recipeId));
    }

    @PostMapping
    private ResponseEntity<?> addIngredientsToRecipe(@RequestBody RecipeIngredientDTO ingredientDTO){

        return ResponseEntity.ok(recipeIngredientService.addIngredientsToRecipe(
                ingredientDTO.getRecipeId(),
                ingredientDTO.getIngredientIds()
                )
        );
    }

}

@Data
class  RecipeIngredientDTO{
    private Integer recipeId;
    private List<Integer> ingredientIds;
}
