package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.dao.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {
    @Query("SELECT p FROM Pharmacy p JOIN p.user u where u.userId = :userId")
    public Pharmacy  findByUserId(Integer userId);
}
