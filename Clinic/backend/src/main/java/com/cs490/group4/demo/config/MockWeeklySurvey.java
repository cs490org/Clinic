package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.WeeklySurvey;
import com.cs490.group4.demo.dto.WeeklySurveyCreateRequestDTO;
import com.cs490.group4.demo.service.WeeklySurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;


@Component
@RequiredArgsConstructor
public class MockWeeklySurvey {
    private final WeeklySurveyService weeklySurveyService;
    public WeeklySurvey createMockWeeklySurvey(Integer patientId, Float weight, LocalDate date){
        WeeklySurveyCreateRequestDTO dto = new WeeklySurveyCreateRequestDTO();
        dto.setPatientId(patientId);
        dto.setWeight(weight);
        dto.setSurveyDate(date);
        return weeklySurveyService.postWeeklySurvey(dto);
    }
}
