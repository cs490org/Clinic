package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Symptom;
import com.cs490.group4.demo.dao.SymptomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SymptomService {

    private final SymptomRepository symptomRepository;

    public SymptomService(SymptomRepository symptomRepository) {
        this.symptomRepository = symptomRepository;
    }

    public Symptom createSymptom(Symptom symptom) {
        return symptomRepository.save(symptom);
    }

    public List<Symptom> getAllSymptoms() {
        return symptomRepository.findAll();
    }

    public boolean isEmpty(){
        return symptomRepository.findAll().isEmpty();
    }
}
