package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.DailySurvey;
import com.cs490.group4.demo.dto.DailySurveyCreateRequestDTO;
import com.cs490.group4.demo.service.DailySurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class MockDailySurvey {
    private final DailySurveyService dailySurveyService;
    public DailySurvey createMockDailySurvey(Integer patientId, Integer caloriesEaten, Integer mood, LocalDate surveyDate) {
        DailySurveyCreateRequestDTO dto= new DailySurveyCreateRequestDTO();
        dto.setPatientId(patientId);
        dto.setCaloriesEaten(caloriesEaten);
        dto.setMood(mood);
        dto.setSurveyDate(surveyDate);
        return dailySurveyService.postDailySurvey(dto);
    }
}
