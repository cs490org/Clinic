package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.dao.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {

}
