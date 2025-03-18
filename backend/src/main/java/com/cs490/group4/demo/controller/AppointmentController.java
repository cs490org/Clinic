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
    private ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }


    // Get appointments by doctor id, optionally filtering by status code
    @GetMapping("/{doctor_id}")
    private ResponseEntity<?> getAppointmentById(@PathVariable Integer doctor_id,
                                                 @RequestParam(required = false) String status) {
        if (status != null) {
            switch (status) {
                case "PENDING":
                    return ResponseEntity.ok(appointmentService.findByStatusCodeIdAndDoctorId(1, doctor_id));
                case "CONFIRMED":
                    return ResponseEntity.ok(appointmentService.findByStatusCodeIdAndDoctorId(2, doctor_id));
                case "CANCELLED":
                    return ResponseEntity.ok(appointmentService.findByStatusCodeIdAndDoctorId(3, doctor_id));
                default:
                    return ResponseEntity.badRequest().body("Invalid status value: " + status);
            }
        }
        return ResponseEntity.ok(appointmentService.findByDoctorId(doctor_id));
    }


    @PostMapping()
    private ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(appointment);
    }
}