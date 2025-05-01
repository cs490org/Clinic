package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.PrescriptionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
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
    private DoctorRepository doctorRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DrugRepository drugRepository;

    public List<Prescription> getPrescriptions(){
        return prescriptionRepository.findAll();
    }
    public Prescription createPrescription(PrescriptionRequest dto){
        Doctor doctor =  doctorRepository.findById(dto.getDoctorId()).orElse(null);
        Patient patient = patientRepository.findById(dto.getPatientId()).orElse(null);
        Drug drug = drugRepository.findById(dto.getDrugId()).orElse(null);

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);
        prescription.setDrug(drug);
        prescription.setRxStatusCode(RxStatusCode.NEW_PRESCRIPTION);
        prescription.setRxExpiryTimestamp(dto.getRxExpiryTimestamp());
        prescription.setCreateTimestamp(LocalDateTime.now());
        prescription.setUpdateTimestamp(LocalDateTime.now());

        return prescriptionRepository.save(prescription);
    }

    public boolean isEmpty(){
        return prescriptionRepository.findAll().isEmpty();
    }

}
