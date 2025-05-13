package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AllergiesServiceTest {

    @Mock private AllergyRepository allergyRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private IngredientRepository ingredientRepository;
    @InjectMocks private AllergiesService allergiesService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllergiesByPatientId_returnsList() {
        Allergy allergy = new Allergy();
        when(allergyRepository.findByPatientId(1)).thenReturn(List.of(allergy));

        List<Allergy> result = allergiesService.getAllergiesByPatientId(1);

        assertEquals(1, result.size());
        verify(allergyRepository).findByPatientId(1);
    }

    @Test
    void setAllergies_patientExists_allergiesSet() {
        Integer patientId = 1;
        List<Integer> ingredientIds = List.of(10, 20);

        Patient patient = new Patient();
        Ingredient ing1 = new Ingredient(); ing1.setId(10);
        Ingredient ing2 = new Ingredient(); ing2.setId(20);
        Allergy a1 = new Allergy(); a1.setIngredient(ing1); a1.setPatient(patient);
        Allergy a2 = new Allergy(); a2.setIngredient(ing2); a2.setPatient(patient);

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(allergyRepository.findByPatientId(patientId)).thenReturn(List.of()); // no existing
        when(ingredientRepository.findAllById(ingredientIds)).thenReturn(List.of(ing1, ing2));
        when(allergyRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0)); // echo saved allergy

        List<Allergy> result = allergiesService.setAllergies(patientId, ingredientIds);

        assertEquals(2, result.size());
        assertEquals(10, result.get(0).getIngredient().getId());
        assertEquals(20, result.get(1).getIngredient().getId());

        verify(allergyRepository).deleteAll(any());
        verify(allergyRepository, times(2)).save(any());
    }

    @Test
    void setAllergies_patientMissing_throws() {
        when(patientRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                allergiesService.setAllergies(1, List.of(1, 2)));

        assertTrue(ex.getMessage().contains("Patient not found"));
    }
}
