package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.MealPlanCreateRequestDTO;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MealPlanServiceTest {

    @Mock private MealPlanRepository mealPlanRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private RecipeRepository recipeRepository;

    @InjectMocks
    private MealPlanService mealPlanService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findAll_returnsListOfMealPlans() {
        MealPlan m1 = new MealPlan();
        MealPlan m2 = new MealPlan();
        when(mealPlanRepository.findAll()).thenReturn(List.of(m1, m2));

        List<MealPlan> result = mealPlanService.findAll();

        assertEquals(2, result.size());
    }

    @Test
    void findByPatientId_returnsCorrectList() {
        MealPlan m = new MealPlan();
        when(mealPlanRepository.findByPatientId(1)).thenReturn(List.of(m));

        List<MealPlan> result = mealPlanService.findByPatientId(1);

        assertEquals(1, result.size());
    }

    @Test
    void createMealPlan_success() {
        MealPlanCreateRequestDTO dto = new MealPlanCreateRequestDTO();
        dto.setPatientId(1);
        dto.setBreakfastId(2);
        dto.setLunchId(3);
        dto.setDinnerId(4);

        Patient patient = new Patient();
        Recipe breakfast = new Recipe();
        Recipe lunch = new Recipe();
        Recipe dinner = new Recipe();

        when(patientRepository.findById(1)).thenReturn(Optional.of(patient));
        when(recipeRepository.findById(2)).thenReturn(Optional.of(breakfast));
        when(recipeRepository.findById(3)).thenReturn(Optional.of(lunch));
        when(recipeRepository.findById(4)).thenReturn(Optional.of(dinner));

        MealPlan saved = new MealPlan();
        when(mealPlanRepository.save(any(MealPlan.class))).thenReturn(saved);

        MealPlan result = mealPlanService.createMealPlan(dto);

        assertNotNull(result);
        verify(mealPlanRepository).save(any(MealPlan.class));
    }

    @Test
    void createMealPlan_missingPatient_throws() {
        MealPlanCreateRequestDTO dto = new MealPlanCreateRequestDTO();
        dto.setPatientId(1);

        when(patientRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> mealPlanService.createMealPlan(dto));
    }

    @Test
    void createMealPlan_missingRecipe_throws() {
        MealPlanCreateRequestDTO dto = new MealPlanCreateRequestDTO();
        dto.setPatientId(1);
        dto.setBreakfastId(2);
        dto.setLunchId(3);
        dto.setDinnerId(4);

        when(patientRepository.findById(1)).thenReturn(Optional.of(new Patient()));
        when(recipeRepository.findById(2)).thenReturn(Optional.empty()); // Simulate missing recipe

        assertThrows(EntityNotFoundException.class, () -> mealPlanService.createMealPlan(dto));
    }
}
