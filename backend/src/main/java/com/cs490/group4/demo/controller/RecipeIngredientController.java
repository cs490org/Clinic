package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dto.IngredientRequestDTO;
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
    private ResponseEntity<?> getIngredientDTOs(@RequestParam(required = true) Integer recipeId){
        return ResponseEntity.ok(recipeIngredientService.getIngredientDTOsFromRecipeId(recipeId));
    }

    @PostMapping
    private ResponseEntity<?> addIngredientsToRecipe(@RequestBody RecipeIngredientDTO recipeIngredientDTO){

        return ResponseEntity.ok(recipeIngredientService.addIngredientsToRecipe(
                recipeIngredientDTO.getRecipeId(),
                recipeIngredientDTO.getIngredientRequestDTOS()
                )
        );
    }

}

@Data
class  RecipeIngredientDTO{
    private Integer recipeId;
    private List<IngredientRequestDTO> ingredientRequestDTOS;
}
