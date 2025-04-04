package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.RecipeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/recipes")
public class RecipeController{

    private final RecipeService recipeService;

    @GetMapping()
    private ResponseEntity<?> getRecipes(){
        return ResponseEntity.ok(recipeService.getRecipes());
    }

    @PostMapping()
    private ResponseEntity<?> createRecipe(@RequestBody RecipeCreateDTO body){
        return ResponseEntity.ok(recipeService.createRecipe(
                body.getUserId(),
                body.getName(),
                body.getDescription(),
                body.getIngredientIds(),
                body.getInstructions()
        ));
    }
}

@Data
class RecipeCreateDTO{
    private Integer userId;
    private String name;
    private String description;
    private List<Integer> ingredientIds;
    private String instructions;
}
