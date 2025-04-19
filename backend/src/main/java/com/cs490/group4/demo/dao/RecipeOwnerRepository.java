package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeOwnerRepository extends JpaRepository<RecipeOwner, Integer> {
    void deleteByRecipeId(Integer id);
    void deleteAllByRecipeId(Integer id);
}