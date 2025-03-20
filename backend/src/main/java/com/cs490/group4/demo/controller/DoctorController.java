package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.DoctorService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping()
    private ResponseEntity<?> getDoctors(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
        } else {
            return ResponseEntity.ok(doctorService.getAllDoctors());
        }
    }

    @PostMapping()
    private ResponseEntity<?> createDoctor(@RequestBody DoctorCreateRequest request) {
        return ResponseEntity.ok(doctorService.createDoctor(
                request.getUserId(),
                request.getPhone(),
                request.getSpecialty(),
                request.getLicenseNumber()
        ));
    }
}

@Data
class DoctorCreateRequest {
    private Integer userId;
    private String phone;
    private String specialty;
    private Long licenseNumber;
}