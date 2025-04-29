package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WeeklySurveyRepository extends JpaRepository<WeeklySurvey,Integer> {
    public List<WeeklySurvey> findByPatientId(Integer patientId);
    List<WeeklySurvey> findByPatientIdOrderByStartDateAsc(Integer patientId);
    List<WeeklySurvey> findByStartDateAndPatientId(LocalDate startDate, Integer patientId);
}

