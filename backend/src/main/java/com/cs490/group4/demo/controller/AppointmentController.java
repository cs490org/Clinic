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
    private ResponseEntity<?> getAppointments(@RequestParam(required = false) Integer doctor_id,
                                              @RequestParam(required = false) String status) {
        if (doctor_id != null) {
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
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }


    @PostMapping()
    private ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(appointment);
    }

    @PatchMapping("/{appointment_id}/confirm")
    private ResponseEntity<?> confirmAppointment(@PathVariable Integer appointment_id) {
        boolean updated = appointmentService.confirmAppointment(appointment_id);
        if (updated) {
            return ResponseEntity.ok("Appointment confirmed successfully");
        } else {
            return ResponseEntity.badRequest().body("Appointment not found or not in pending state");
        }
    }

    @PatchMapping("/{appointment_id}/reject")
    private ResponseEntity<?> rejectAppointment(@PathVariable Integer appointment_id) {
        boolean updated = appointmentService.rejectAppointment(appointment_id);
        if (updated) {
            return ResponseEntity.ok("Appointment rejected successfully");
        } else {
            return ResponseEntity.badRequest().body("Appointment not found or not in pending state");
        }
    }

}