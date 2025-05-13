package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@RequiredArgsConstructor
public class MockRecipe {
    private final RecipeService recipeService;

    public Recipe createMockRecipe(String name, String description, String instructions, List<IngredientRequestDTO> ingredientRequestDTOS, Integer authorId,String img_uri) {
      return  recipeService.createRecipe(authorId,name, description, ingredientRequestDTOS,instructions,img_uri);
   }

}
