package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentStatusCodeRepository extends JpaRepository<AppointmentStatusCode, Integer> {

    //https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
    AppointmentStatusCode findByStatus(String status);
}