package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.DailySurvey;
import com.cs490.group4.demo.dao.DailySurveyRepository;
import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientRepository;
import com.cs490.group4.demo.dto.DailySurveyCreateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailySurveyService {
    private final DailySurveyRepository dailySurveyRepository;
    private final PatientRepository patientRepository;

    public List<DailySurvey> getDailySurveysForPatientId(Integer patientId) {
//        return dailySurveyRepository.findByPatientId(patientId);
        return dailySurveyRepository.findByPatientIdOrderBySurveyDateAsc(patientId);
    }

    // post daily survey, ensuring that we havent already done so for today.
    public DailySurvey postDailySurvey(DailySurveyCreateRequestDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId()).orElseThrow(()->new IllegalArgumentException("Patient not found"));
        if(!dailySurveyRepository.findBySurveyDate(dto.getSurveyDate()).isEmpty()) {
            throw new IllegalArgumentException("Survey date already exists");
        }
        DailySurvey dailySurvey = new DailySurvey();
        dailySurvey.setPatient(patient);
        dailySurvey.setCaloriesEaten(dto.getCaloriesEaten());
        dailySurvey.setMood(dto.getMood());
        dailySurvey.setSurveyDate(dto.getSurveyDate());
        return dailySurveyRepository.save(dailySurvey);
    }
    public Boolean checkIfPatientDidSurveyForToday(Integer patientId) {
        List<DailySurvey> surveys = dailySurveyRepository.findByPatientId(patientId);
        for(DailySurvey survey : surveys) {
            if(survey.getSurveyDate().equals(LocalDate.now())) {
                return true;
            }
        }
        return false;
    }

    public boolean isEmpty(){
        return dailySurveyRepository.count() == 0;
    }
}
