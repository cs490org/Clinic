package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.DoctorService;
import com.cs490.group4.demo.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping()
    private ResponseEntity<?> getPatients(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(patientService.getPatientByUserId(userId));
        } else {
            return ResponseEntity.ok(patientService.getAllPatients());
        }
    }
}