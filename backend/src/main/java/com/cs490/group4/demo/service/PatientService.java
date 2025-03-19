package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient getPatientByUserId(Integer userId) {
        return patientRepository.findByUserId(userId);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public boolean isEmpty() {
        return patientRepository.count() == 0;
    }

}
