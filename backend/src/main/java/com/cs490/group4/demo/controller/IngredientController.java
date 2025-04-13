package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;

    @GetMapping
    private ResponseEntity<?> getIngredients() {
        return ResponseEntity.ok(ingredientService.getIngredients());
    }
}
