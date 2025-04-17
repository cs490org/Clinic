package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Prescription;
import com.cs490.group4.demo.dto.PrescriptionRequest;
import com.cs490.group4.demo.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/prescription")
    private ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequest prescriptionRequest){
        return ResponseEntity.ok(prescriptionService.createPrescription(prescriptionRequest));
    }

}
