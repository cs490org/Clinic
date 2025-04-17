package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dto.RecipeCreateDTO;
import com.cs490.group4.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequiredArgsConstructor
@RequestMapping("/recipes")
public class RecipeController{

    private final RecipeService recipeService;

    @GetMapping()
    private ResponseEntity<?> getRecipes(){
        return ResponseEntity.ok(recipeService.getRecipes());
    }

    @PostMapping(consumes = {"application/json", "multipart/form-data"})
    private ResponseEntity<?> createRecipe(@ModelAttribute RecipeCreateDTO body){
        // MultipartFile for image in DTO

        return ResponseEntity.ok(recipeService.createRecipe(
                body.getUserId(),
                body.getName(),
                body.getDescription(),
                body.getIngredientRequestDTOS(),
                body.getInstructions(),
                body.getImage()
        ));
    }
}

