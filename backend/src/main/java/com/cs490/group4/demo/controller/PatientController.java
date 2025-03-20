package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.DoctorService;
import com.cs490.group4.demo.service.PatientPharmacyService;
import com.cs490.group4.demo.service.PatientService;
import com.cs490.group4.demo.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.Data;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private PatientPharmacyService patientPharmacyService;

    @GetMapping()
    private ResponseEntity<?> getPatients(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(patientService.getPatientByUserId(userId));
        } else {
            return ResponseEntity.ok(patientService.getAllPatients());
        }
    }

    @GetMapping("/preferred_pharmacy")
    private ResponseEntity<?> getPreferredPharmacy(@RequestParam(required = true) Integer patientId) {
        return ResponseEntity.ok(patientPharmacyService.getByPatientId(patientId));
    }

    @PostMapping()
    private ResponseEntity<?> createPatient(@RequestBody PatientCreateRequest request) {
        return ResponseEntity.ok(patientService.createPatient(
            request.getUserId(),
            request.getPhone(),
            request.getAddress(),
            request.getPharmacyId()
        ));
    }
}

// these fields will be passed from the patient complete profile page
@Data
class PatientCreateRequest {
    private Integer userId;
    private String phone;
    private String address;
    private Integer pharmacyId;
}