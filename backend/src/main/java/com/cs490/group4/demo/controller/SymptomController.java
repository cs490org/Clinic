package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Symptom;
import com.cs490.group4.demo.dao.SymptomType;
import com.cs490.group4.demo.service.SymptomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SymptomController {
    private final SymptomService symptomService;
    @GetMapping("/symptoms")
    public List<Symptom> getSymptoms() {
        return symptomService.getAllSymptoms();
    }


    @GetMapping("/symptomTypes")
    public List<SymptomType> getSymptomTypes() {
        return Arrays.asList(SymptomType.values());
    }
}
