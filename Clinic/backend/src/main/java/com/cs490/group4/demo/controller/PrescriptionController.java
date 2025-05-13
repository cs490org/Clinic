package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Drug;
import com.cs490.group4.demo.dao.Prescription;
import com.cs490.group4.demo.dto.PrescriptionRequest;
import com.cs490.group4.demo.service.PrescriptionService;
import com.google.rpc.context.AttributeContext.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;


    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getPrescriptions(){
        return ResponseEntity.ok(prescriptionService.getPrescriptions());
    }
    /* 
    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getPrescriptions(@RequestParam(value = "patient_id", required = false) Integer patientId) {
        if (patientId != null) {
            return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(patientId));
        }
        return ResponseEntity.ok(prescriptionService.getPrescriptions());
    } */
    @PostMapping("/prescription")
    private ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequest prescriptionRequest){
        return ResponseEntity.ok(prescriptionService.createPrescription(prescriptionRequest));
    }

    @PatchMapping("/{id}/status")
        public ResponseEntity<Prescription> updateStatus(
                @PathVariable Integer id,
                @RequestParam String status) {
            Prescription updated = prescriptionService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
    }

}
