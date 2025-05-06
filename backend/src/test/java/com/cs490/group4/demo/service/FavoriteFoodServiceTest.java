package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FavoriteFoodServiceTest {

    @Mock private FavoriteFoodRepository favoriteFoodRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private IngredientRepository ingredientRepository;
    @InjectMocks private FavoriteFoodService favoriteFoodService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getFavoriteFoodByPatientId_returnsFavoriteFood() {
        FavoriteFood favorite = new FavoriteFood();
        when(favoriteFoodRepository.getFavoriteFoodByPatientId(1)).thenReturn(favorite);

        FavoriteFood result = favoriteFoodService.getFavoriteFoodByPatientId(1);

        assertEquals(favorite, result);
        verify(favoriteFoodRepository).getFavoriteFoodByPatientId(1);
    }

    @Test
    void setFavoriteFoodByPatientId_success() {
        Patient patient = new Patient(); patient.setId(1);
        Ingredient ingredient = new Ingredient(); ingredient.setId(10);
        FavoriteFood favorite = new FavoriteFood();

        when(patientRepository.findById(1)).thenReturn(Optional.of(patient));
        when(ingredientRepository.findById(10)).thenReturn(Optional.of(ingredient));
        when(favoriteFoodRepository.save(any())).thenReturn(favorite);

        FavoriteFood result = favoriteFoodService.setFavoriteFoodByPatientId(1, 10);

        assertNotNull(result);
        verify(patientRepository).findById(1);
        verify(ingredientRepository).findById(10);
        verify(favoriteFoodRepository).save(any(FavoriteFood.class));
    }

    @Test
    void setFavoriteFoodByPatientId_missingPatient_throws() {
        when(patientRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> favoriteFoodService.setFavoriteFoodByPatientId(1, 10));

        assertTrue(ex.getMessage().contains("Patient not found"));
    }

    @Test
    void setFavoriteFoodByPatientId_missingIngredient_throws() {
        when(patientRepository.findById(1)).thenReturn(Optional.of(new Patient()));
        when(ingredientRepository.findById(10)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> favoriteFoodService.setFavoriteFoodByPatientId(1, 10));

        assertTrue(ex.getMessage().contains("Ingredient not found"));
    }
}
