package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@RequiredArgsConstructor
public class MockRecipe {
    private final RecipeService recipeService;

    public Recipe createMockRecipe(String name, String description, String instructions, List<Integer> ingredientIds, Integer authorId) {
      return  recipeService.createRecipe(authorId,name, description,ingredientIds,instructions);
   }

}
