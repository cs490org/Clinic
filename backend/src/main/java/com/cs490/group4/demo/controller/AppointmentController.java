package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.cs490.group4.demo.dao.Appointment;

@RestController
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/appointments")
    private ResponseEntity<?> getAllAppointments(){
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PostMapping("/appointments")
    private ResponseEntity<?> createAppointment(@RequestBody Appointment appointment){
        appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(appointment);
    }
}