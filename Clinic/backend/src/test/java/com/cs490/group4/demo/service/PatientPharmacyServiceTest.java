package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.PatientPharmacy;
import com.cs490.group4.demo.dao.PatientPharmacyRepository;
import com.cs490.group4.demo.dao.Pharmacy;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientPharmacyServiceTest {

    @Mock
    private PatientPharmacyRepository patientPharmacyRepository;

    @InjectMocks
    private PatientPharmacyService patientPharmacyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getByPatientId_valid_returnsPharmacy() {
        Pharmacy pharmacy = new Pharmacy();
        PatientPharmacy patientPharmacy = new PatientPharmacy();
        patientPharmacy.setPharmacy(pharmacy);

        when(patientPharmacyRepository.getByPatientId(1)).thenReturn(patientPharmacy);

        Pharmacy result = patientPharmacyService.getByPatientId(1);

        assertNotNull(result);
        assertEquals(pharmacy, result);
    }

    @Test
    void getByPatientId_nullResult_throws() {
        when(patientPharmacyRepository.getByPatientId(1)).thenReturn(null);

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () ->
                patientPharmacyService.getByPatientId(1));

        assertTrue(ex.getMessage().contains("pharmacy for patient ID"));
    }

    @Test
    void getByPatientId_nullPharmacyInResult_throws() {
        PatientPharmacy patientPharmacy = new PatientPharmacy();
        patientPharmacy.setPharmacy(null);

        when(patientPharmacyRepository.getByPatientId(1)).thenReturn(patientPharmacy);

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () ->
                patientPharmacyService.getByPatientId(1));

        assertTrue(ex.getMessage().contains("pharmacy for patient ID"));
    }
}
