package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.ChosenDoctor;
import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.service.ChosenDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ChosenDoctorController {

    @Autowired
    private ChosenDoctorService chosenDoctorService;

    @GetMapping("/doctor/patients")
    private ResponseEntity<List<Patient>> getPatientsByDoctor(@RequestParam Integer doctorId) {
        return ResponseEntity.ok(chosenDoctorService.getPatientsByDoctor(doctorId));
    }

    @PutMapping("/patient/doctor")
    private ResponseEntity<ChosenDoctor> assignPatientToDoctor(@RequestParam Integer patientId, @RequestParam Integer doctorId){
        return ResponseEntity.ok(chosenDoctorService.assignPatientToDoctor(patientId, doctorId));
    }

    @DeleteMapping("/patient/doctor")
    private ResponseEntity<?> deletePatientDoctor(@RequestParam Integer patientId) {
        chosenDoctorService.deletePatientDoctor(patientId);
        return ResponseEntity.status(200).build();
    }

}
