package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Allergy;
import com.cs490.group4.demo.service.AllergiesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/allergies")
@RequiredArgsConstructor
public class AllergiesController {
    private final AllergiesService allergiesService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Allergy>> getPatientAllergies(@PathVariable Integer patientId) {
        List<Allergy> allergies = allergiesService.getAllergiesByPatientId(patientId);
        return ResponseEntity.ok(allergies);
    }

    @PutMapping("/patient/{patientId}")
    public ResponseEntity<List<Allergy>> setAllergies(

            @PathVariable Integer patientId,
            @RequestBody List<Integer> ingredientIds
    ) {
        List<Allergy> newAllergies = allergiesService.setAllergies(patientId, ingredientIds);
        return ResponseEntity.ok(newAllergies);
    }
}
