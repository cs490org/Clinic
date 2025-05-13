package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Ingredient;
import com.cs490.group4.demo.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;

    @GetMapping
    private ResponseEntity<?> getIngredients() {
        return ResponseEntity.ok(ingredientService.getIngredients());
    }

    @PostMapping
    private ResponseEntity<?> createIngredient(@RequestBody Ingredient ingredient) {
        return ResponseEntity.ok(ingredientService.createIngredient(ingredient));
    }
}
