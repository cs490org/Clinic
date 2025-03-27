package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dao.RecipeRepository;
import com.cs490.group4.demo.security.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class MockRecipe {
   private final RecipeRepository recipeRepository;

   public void createMockRecipe(String name, String description, User author) {
       Recipe recipe = new Recipe();
       recipe.setName(name);
       recipe.setDescription(description);
       recipe.setAuthor(author);
       recipe.setCreateTimestamp(LocalDateTime.now());
       recipeRepository.save(recipe);
   }

}
