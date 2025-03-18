package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cs490.group4.demo.dao.Appointment;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping()
    private ResponseEntity<?> getAllAppointments(){
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{doctor_id}")
    private ResponseEntity<?> getAppointmentById(@PathVariable Integer doctor_id){
        return ResponseEntity.ok(appointmentService.findByDoctorId(doctor_id));
    }

    @PostMapping()
    private ResponseEntity<?> createAppointment(@RequestBody Appointment appointment){
        appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(appointment);
    }
}