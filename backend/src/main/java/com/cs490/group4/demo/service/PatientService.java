package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.PatientChartRequest;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PharmacyRepository pharmacyRepository;
    @Autowired
    private PatientPharmacyRepository patientPharmacyRepository;

    @Autowired
    private PatientChartRepository patientChartRepository;

    public Patient getPatientByUserId(Integer userId) {
        Patient patient = patientRepository.findByUserId(userId);
        if (patient == null) {
            throw new EntityNotFoundException("patient not found with userId " + userId + ", user needs to set up patient info.");
        }
        return patient;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public boolean isEmpty() {
        return patientRepository.count() == 0;
    }

    public Patient createPatient(Integer userId, String phone, String address, Integer pharmacyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found with ID: " + pharmacyId));

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(user.getFirstName());
        patient.setLastName(user.getLastName());
        patient.setEmail(user.getEmail());
        patient.setPhone(phone);
        patient.setAddress(address);
        patient = patientRepository.save(patient);

        // preferred pharmacy
        PatientPharmacy patientPharmacy = new PatientPharmacy();
        patientPharmacy.setPatient(patient);
        patientPharmacy.setPharmacy(pharmacy);
        patientPharmacyRepository.save(patientPharmacy);

        return patient;
    }

    public PatientChart updatePatientChart(PatientChartRequest dto){
        Optional<PatientChart> existingPatientChart =  patientChartRepository.findByPatientId(dto.getPatientId());

        PatientChart patientChart;

        if(existingPatientChart.isPresent()){
            patientChart = PatientChart.builder()
                    .id(existingPatientChart.get().getId())
                    .patient(Patient.builder().id(dto.getPatientId()).build())
                    .age(dto.getAge())
                    .weight(dto.getWeight())
                    .height(dto.getHeight())
                    .sex(dto.getSex())
                    .updateTimestamp(LocalDateTime.now())
                    .build();

        }else{
            patientChart = PatientChart.builder()
                    .patient(Patient.builder().id(dto.getPatientId()).build())
                    .age(dto.getAge())
                    .weight(dto.getWeight())
                    .height(dto.getHeight())
                    .sex(dto.getSex())
                    .createTimestamp(LocalDateTime.now())
                    .build();
        }

        return patientChartRepository.save(patientChart);
    }
}
