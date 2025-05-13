package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteFoodRepository extends JpaRepository<FavoriteFood, Integer> {
    public FavoriteFood getFavoriteFoodByPatientId(Integer patientId);
}