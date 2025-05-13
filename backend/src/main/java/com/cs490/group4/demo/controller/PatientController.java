package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PatientChart;
import com.cs490.group4.demo.dto.PatientChartRequest;
import com.cs490.group4.demo.service.PatientPharmacyService;
import com.cs490.group4.demo.service.PatientService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/by-pharmacy")
private ResponseEntity<?> getPatientsByPharmacy(@RequestParam Integer pharmacyId) {
    return ResponseEntity.ok(patientPharmacyService.getPatientsByPharmacyId(pharmacyId));
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

    @PutMapping("/chart")
    private ResponseEntity<PatientChart> updatePatientChart(@RequestBody PatientChartRequest patientChartRequest){
        return ResponseEntity.ok(patientService.updatePatientChart(patientChartRequest));
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