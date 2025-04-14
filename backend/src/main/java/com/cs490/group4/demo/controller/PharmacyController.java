package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dto.PharmacyCreateDTO;
import com.cs490.group4.demo.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pharmacies")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @GetMapping()
    private ResponseEntity<?> getPharmacies(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(pharmacyService.getPharmacyByUserId(userId));
        } else {
            return ResponseEntity.ok(pharmacyService.getPharmacies());
        }
    }

    @PostMapping
    private ResponseEntity<?> createPharmacy(@RequestBody PharmacyCreateDTO pharmacyCreateDTO) {
        return ResponseEntity.ok(pharmacyService.createPharmacy(pharmacyCreateDTO));
    }
}
