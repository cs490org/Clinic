package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Prescription;
import com.cs490.group4.demo.dto.PrescriptionRequest;
import com.cs490.group4.demo.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class MockPrescription {
    private final PrescriptionService prescriptionService;

    public Prescription createMockPrescription(Integer doctorId, Integer patientId, Integer drugId, LocalDateTime rxExpiryTimestamp){
        PrescriptionRequest prescriptionRequest = new PrescriptionRequest();
        prescriptionRequest.setDoctorId(doctorId);
        prescriptionRequest.setPatientId(patientId);
        prescriptionRequest.setDrugId(drugId);
        prescriptionRequest.setRxExpiryTimestamp(rxExpiryTimestamp);
        return prescriptionService.createPrescription(prescriptionRequest);
    }
}
