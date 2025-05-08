package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PatientSymptoms;
import com.cs490.group4.demo.dto.PatientSymptomCreateRequestDTO;
import com.cs490.group4.demo.service.PatientSymptomsService;
import lombok.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class PatientSymptomsController {
    private final PatientSymptomsService patientSymptomsService;

    public PatientSymptomsController(PatientSymptomsService patientSymptomsService) {
        this.patientSymptomsService = patientSymptomsService;
    }

    @GetMapping("/patient/{patientId}/symptoms")
    public ResponseEntity<List<PatientSymptoms>> getPatientSymptoms(@PathVariable Integer patientId) {
        return ResponseEntity.ok(patientSymptomsService.findAllPatientSymptomsByPatientId(patientId));
    }

    @PutMapping("/patient/{patientId}/symptoms")
    public ResponseEntity<List<PatientSymptoms>> updatePatientSymptoms(@PathVariable Integer patientId, @RequestBody List<PatientSymptomCreateRequestDTO> symptoms) {
        return ResponseEntity.ok(patientSymptomsService.setPatientSymptoms(symptoms));
    }
}
