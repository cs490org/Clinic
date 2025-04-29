package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.DailySurvey;
import com.cs490.group4.demo.dto.DailySurveyCreateRequestDTO;
import com.cs490.group4.demo.service.DailySurveyService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/daily_surveys")
public class DailySurveyController {


    private final DailySurveyService dailySurveyService;

    public DailySurveyController(DailySurveyService dailySurveyService) {
        this.dailySurveyService = dailySurveyService;
    }

    @GetMapping
    public ResponseEntity<List<DailySurvey>> getDailySurveyFromPatientId(@RequestParam Integer patientId) {
        return ResponseEntity.ok(dailySurveyService.getDailySurveysForPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<DailySurvey> postDailySurvey(@RequestBody DailySurveyCreateRequestDTO dto) {
        dto.setSurveyDate(LocalDate.now());
        return ResponseEntity.ok(dailySurveyService.postDailySurvey(dto));
    }

}
