package com.cs490.group4.demo.config;

import com.cs490.group4.demo.service.RecipeCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class MockRecipeComment {
    private final RecipeCommentService recipeCommentService;

    public void createMockRecipeComment(Integer recipeId, Integer userId,String comment) {
        recipeCommentService.createComment(recipeId, userId, comment);
   }

}
