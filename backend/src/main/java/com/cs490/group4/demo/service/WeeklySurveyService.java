package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.WeeklySurveyCreateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklySurveyService {
    private final PatientRepository patientRepository;
    private final WeeklySurveyRepository weeklySurveyRepository;

    public List<WeeklySurvey> getWeeklySurveysForPatientId(Integer patientId) {
        return weeklySurveyRepository.findByPatientIdOrderByStartDateAsc(patientId);
    }

    // post weekly survey, ensuring that we havent already done so for today.
    public WeeklySurvey postWeeklySurvey(WeeklySurveyCreateRequestDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId()).orElseThrow(()->new IllegalArgumentException("Patient not found"));
//        LocalDate surveyDate= LocalDate.now();
        LocalDate surveyDate= dto.getSurveyDate();
        LocalDate startOfWeek = surveyDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = surveyDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        // already did weekly survey for that date.
        if(!weeklySurveyRepository.findByStartDateAndPatientId(startOfWeek,dto.getPatientId()).isEmpty()) {
            throw new IllegalArgumentException("Survey date already exists");
        }
        WeeklySurvey weeklySurvey= new WeeklySurvey();
        weeklySurvey.setPatient(patient);
        weeklySurvey.setWeight(dto.getWeight());

        weeklySurvey.setSurveyDate(dto.getSurveyDate());
        weeklySurvey.setStartDate(startOfWeek);
        weeklySurvey.setEndDate(endOfWeek);
        return weeklySurveyRepository.save(weeklySurvey);
    }

    public Boolean checkIfPatientDidSurveyForWeek(Integer patientId ) {
        List<WeeklySurvey> surveys = weeklySurveyRepository.findByPatientId(patientId);
        LocalDate now = LocalDate.now();
        for (WeeklySurvey survey : surveys) {
            if (!now.isBefore(survey.getStartDate()) && !now.isAfter(survey.getEndDate())) {
                return true;
            }
        }
        return false;
    }

    public LocalDate getStartDate(LocalDate date) {
        return date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }


    public boolean isEmpty(){
        return weeklySurveyRepository.count() == 0;
    }
}
