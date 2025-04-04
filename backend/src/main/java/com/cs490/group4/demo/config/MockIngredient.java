package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Ingredient;
import com.cs490.group4.demo.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MockIngredient {

   private final IngredientService ingredientService;

    public void createMockIngredient(String name,String description,Integer calories, Integer fats, Integer carbs, Integer protein) {
        Ingredient ingredient = new Ingredient();

        ingredient.setName(name);
        ingredient.setDescription(description);

        ingredient.setCalories(calories);
        ingredient.setFats(fats);
        ingredient.setCarbs(carbs);
        ingredient.setProtein(protein);

        ingredientService.createIngredient(ingredient);
    }

}



