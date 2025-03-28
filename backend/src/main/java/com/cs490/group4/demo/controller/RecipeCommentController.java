package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.RecipeCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/recipes/comments")
@RequiredArgsConstructor
public class RecipeCommentController {

    private final RecipeCommentService recipeCommentService;

    @GetMapping
    private ResponseEntity<?> getComments(@RequestParam(required = true) Integer recipeId) {
        return ResponseEntity.ok(recipeCommentService.findByRecipeId(recipeId));
    }

}
