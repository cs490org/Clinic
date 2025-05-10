package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealPlanOwnerRepository extends JpaRepository<MealPlanOwner, Integer> {
    public void deleteAllByMealPlanId(Integer mealPlanId);
}
