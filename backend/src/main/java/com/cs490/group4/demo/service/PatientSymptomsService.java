package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.PatientSymptomCreateRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientSymptomsService {

    private final PatientSymptomsRepository patientSymptomsRepository;
    private final PatientRepository patientRepository;
    private final SymptomRepository symptomRepository;

    public PatientSymptomsService(PatientSymptomsRepository patientSymptomsRepository, PatientRepository patientRepository, SymptomRepository symptomRepository) {
        this.patientSymptomsRepository = patientSymptomsRepository;
        this.patientRepository = patientRepository;
        this.symptomRepository = symptomRepository;
    }

    public List<PatientSymptoms> findAllPatientSymptomsByPatientId(Integer patientId) {
        return patientSymptomsRepository.findAllPatientSymptomsByPatientId(patientId);
    }

    @Transactional
    public List<PatientSymptoms> setPatientSymptoms(List<PatientSymptomCreateRequestDTO> symptoms) {
        patientSymptomsRepository.deleteByPatientId(symptoms.get(0).getPatientId());

        List<PatientSymptoms> patientSymptoms = symptoms.stream().map(dto -> {
            PatientSymptoms ps = new PatientSymptoms();
            Patient patient = patientRepository.findById(dto.getPatientId()).orElseThrow(()-> new EntityNotFoundException("Could not find patient when trying to update symptoms."));
            Symptom symptom = symptomRepository.findById(dto.getSymptomId()).orElseThrow(()->new EntityNotFoundException("Could not find symptom when trying to update symptoms."));
            ps.setPatient(patient);
            ps.setSymptom(symptom);
            return ps;
        }).toList();

        return patientSymptomsRepository.saveAll(patientSymptoms);
    }

}
