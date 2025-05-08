package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Symptom;
import com.cs490.group4.demo.dao.SymptomRepository;
import com.cs490.group4.demo.dao.SymptomType;
import com.cs490.group4.demo.service.SymptomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MockSymptom {
    private final SymptomService symptomService;

    public Symptom createSymptom(String name, SymptomType symptomType) {
        Symptom symptom = new Symptom();
        symptom.setName(name);
        symptom.setSymptomType(symptomType);
        return symptomService.createSymptom(symptom);
    }
}
