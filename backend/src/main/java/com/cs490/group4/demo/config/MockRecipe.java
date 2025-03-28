package com.cs490.group4.demo.config;

import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class MockRecipe {
    private final RecipeService recipeService;

    public void createMockRecipe(String name, String description, User author) {
       recipeService.createRecipe(author.getUserId(), name, description);
   }

}
