package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.PrescriptionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.cs490.group4.demo.constants.RxConstants.NEW_PRESCRIPTION;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public Prescription createPrescription(PrescriptionRequest dto){
        Prescription prescription = Prescription.builder()
                .doctor(Doctor.builder().id(dto.getDoctorId()).build())
                .patient(Patient.builder().id(dto.getPatientId()).build())
                .drug(Drug.builder().id(dto.getDrugId()).build())
                .rxExpiryTimestamp(dto.getRxExpiryTimestamp())
                .createTimestamp(LocalDateTime.now())
                // RxStatusCode "NEW_PRESCRIPTION" needs to exist in the database. We should probably modify the database and enum this
                .rxStatusCode(RxStatusCode.builder().id(NEW_PRESCRIPTION).build())
                .build();

        return prescriptionRepository.save(prescription);
    }

}
