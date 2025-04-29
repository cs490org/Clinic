package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailySurveyRepository extends JpaRepository<DailySurvey,Integer> {
    public List<DailySurvey> findByPatientId(Integer patientId);
    List<DailySurvey> findBySurveyDate(LocalDate surveyDate);
    List<DailySurvey> findByPatientIdOrderBySurveyDateDesc(Integer patientId);
    List<DailySurvey> findByPatientIdOrderBySurveyDateAsc(Integer patientId);
}

