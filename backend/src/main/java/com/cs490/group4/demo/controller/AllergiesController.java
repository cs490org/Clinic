package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Allergies;
import com.cs490.group4.demo.service.AllergiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/allergies")
public class AllergiesController {
    private final AllergiesService allergiesService;

    @Autowired
    public AllergiesController(AllergiesService allergiesService) {
        this.allergiesService = allergiesService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Allergies>> getPatientAllergies(@PathVariable Integer patientId) {
        List<Allergies> allergies = allergiesService.getAllergiesByPatientId(patientId);
        return ResponseEntity.ok(allergies);
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<Allergies> addAllergy(
            @PathVariable Integer patientId,
            @RequestBody List<Integer> ingredientIds
    ) {
        Allergies newAllergy = allergiesService.addAllergy(patientId, ingredientIds);
        return ResponseEntity.ok(newAllergy);
    }
}
