package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RxStatusCodeRepository extends JpaRepository<RxStatusCode, Integer> {
    RxStatusCode findByStatus(String status);
}