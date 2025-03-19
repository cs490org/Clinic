package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}