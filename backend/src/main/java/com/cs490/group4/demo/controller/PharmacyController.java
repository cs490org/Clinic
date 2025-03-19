package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.PatientService;
import com.cs490.group4.demo.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pharmacies")
public class PharmacyController {

    @Autowired
    private PharmacyService pharmacyService;

    @GetMapping()
    private ResponseEntity<?> getPharmacies() {
        return ResponseEntity.ok(pharmacyService.getPharmacies());
    }
}