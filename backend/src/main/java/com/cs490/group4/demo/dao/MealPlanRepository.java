package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealPlanRepository extends JpaRepository<MealPlan, Integer> {
}
