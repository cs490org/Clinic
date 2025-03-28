package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeCommentRepository extends JpaRepository<RecipeComment,Integer> {
    public List<RecipeComment> findAllByRecipeId(Integer recipeId);
}
