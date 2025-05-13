package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PatientAppointmentData;
import com.cs490.group4.demo.dto.PatientAppointmentDataCreateDTO;
import com.cs490.group4.demo.service.PatientAppointmentDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class PatientAppointmentDataController {
    private final PatientAppointmentDataService patientAppointmentDataService;

    public PatientAppointmentDataController(PatientAppointmentDataService patientAppointmentDataService) {
        this.patientAppointmentDataService = patientAppointmentDataService;
    }

    @GetMapping("/patient/{id}/appointment-data")
    public ResponseEntity<List<PatientAppointmentData>> patientAppointmentData(@PathVariable("id") Integer patientId) {
        return ResponseEntity.ok(patientAppointmentDataService.getPatientAppointmentData(patientId));
    }
    @GetMapping("/patient/{patientId}/appointment-data/{appointmentId}")
    public ResponseEntity<PatientAppointmentData> getAppointmentDataIfExists(
            @PathVariable Integer patientId,
            @PathVariable Integer appointmentId
    ) {
        return patientAppointmentDataService.getByPatientAndAppointment(patientId, appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/patient/appointment-data")
    public ResponseEntity<PatientAppointmentData> addPatientAppointmentData(@RequestBody PatientAppointmentDataCreateDTO patientAppointmentDataCreateDTO) {
        return ResponseEntity.ok(patientAppointmentDataService.addPatientAppointmentData(patientAppointmentDataCreateDTO));
    }
}
