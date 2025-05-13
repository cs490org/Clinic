package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.WeeklySurvey;
import com.cs490.group4.demo.dto.WeeklySurveyCreateRequestDTO;
import com.cs490.group4.demo.service.WeeklySurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/weekly_surveys")
@RequiredArgsConstructor
public class WeeklySurveyController {


    private final WeeklySurveyService weeklySurveyService;


    @GetMapping
    public ResponseEntity<List<WeeklySurvey>> getWeeklySurveyFromPatientId(@RequestParam Integer patientId) {
        return ResponseEntity.ok(weeklySurveyService.getWeeklySurveysForPatientId(patientId));
    }
    @GetMapping("/did_it")
    public ResponseEntity<Boolean> isWeeklySurveyExists(@RequestParam Integer patientId) {
        return ResponseEntity.ok(weeklySurveyService.checkIfPatientDidSurveyForWeek(patientId));
    }


    @PostMapping
    public ResponseEntity<WeeklySurvey> postWeeklySurvey(@RequestBody WeeklySurveyCreateRequestDTO dto) {
        dto.setSurveyDate(LocalDate.now());
        return ResponseEntity.ok(weeklySurveyService.postWeeklySurvey(dto));
    }

}
