package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class MockRecipe {
    private final RecipeService recipeService;

    public Recipe createMockRecipe(String name, String description, User author) {
      return  recipeService.createRecipe(author.getUserId(), name, description);
   }

}
