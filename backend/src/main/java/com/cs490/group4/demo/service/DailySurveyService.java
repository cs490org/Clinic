package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.DailySurvey;
import com.cs490.group4.demo.dao.DailySurveyRepository;
import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientRepository;
import com.cs490.group4.demo.dto.DailySurveyCreateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DailySurveyService {
    private final DailySurveyRepository dailySurveyRepository;
    private final PatientRepository patientRepository;

    public List<DailySurvey> getDailySurveysForPatientId(Integer patientId) {
        return dailySurveyRepository.findByPatientId(patientId);
    }

    public DailySurvey postDailySurvey(DailySurveyCreateRequestDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId()).orElseThrow(()->new IllegalArgumentException("Patient not found"));
        DailySurvey dailySurvey = new DailySurvey();
        dailySurvey.setPatient(patient);
        dailySurvey.setCaloriesEaten(dto.getCaloriesEaten());
        dailySurvey.setMood(dto.getMood());
        dailySurvey.setSurveyDate(dto.getSurveyDate());
        return dailySurveyRepository.save(dailySurvey);
    }

    public boolean isEmpty(){
        return dailySurveyRepository.count() == 0;
    }
}
