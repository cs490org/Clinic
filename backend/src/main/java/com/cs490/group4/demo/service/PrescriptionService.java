package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.PrescriptionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.cs490.group4.demo.constants.RxConstants.NEW_PRESCRIPTION;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private RxStatusCodeRepository rxStatusCodeRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DrugRepository drugRepository;

    public List<Prescription> getPrescriptions(){
        return prescriptionRepository.findAll();
    }
    public Prescription createPrescription(PrescriptionRequest dto){
        RxStatusCode status = rxStatusCodeRepository
                .findByStatus("NEW_PRESCRIPTION");

        Doctor doctor =  doctorRepository.findById(dto.getDoctorId()).orElse(null);
        Patient patient = patientRepository.findById(dto.getPatientId()).orElse(null);
        Drug drug = drugRepository.findById(dto.getDrugId()).orElse(null);

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);
        prescription.setDrug(drug);
        prescription.setRxStatusCode(status);
        prescription.setRxExpiryTimestamp(dto.getRxExpiryTimestamp());
//        Prescription prescription = Prescription.builder()
//                .doctor(Doctor.builder().id(dto.getDoctorId()).build())
//                .patient(Patient.builder().id(dto.getPatientId()).build())
//                .drug(Drug.builder().id(dto.getDrugId()).build())
//                .rxExpiryTimestamp(dto.getRxExpiryTimestamp())
//                .createTimestamp(LocalDateTime.now())
//                // RxStatusCode "NEW_PRESCRIPTION" needs to exist in the database. We should probably modify the database and enum this
////                .rxStatusCode(RxStatusCode.builder().id(NEW_PRESCRIPTION).build())
//                .rxStatusCode(status)
//                .build();

        return prescriptionRepository.save(prescription);
    }

    public boolean isEmpty(){
        return prescriptionRepository.findAll().isEmpty();
    }

}
