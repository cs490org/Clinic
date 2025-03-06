package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/doctors")
    private ResponseEntity<?> getAllDoctors(){
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }
}