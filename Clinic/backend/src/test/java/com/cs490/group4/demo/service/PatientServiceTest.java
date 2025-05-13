package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.PatientChartRequest;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import com.cs490.group4.demo.service.PatientService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PharmacyRepository pharmacyRepository;
    @Mock
    private PatientChartRepository patientChartRepository;
    @Mock
    private PatientPharmacyRepository patientPharmacyRepository;

    @InjectMocks
    private PatientService patientService;

    @Test
    void getPatientByUserId_returnsPatient() {
        Patient mockPatient = new Patient();
        mockPatient.setId(1);
        when(patientRepository.findByUserId(1)).thenReturn(mockPatient);

        Patient result = patientService.getPatientByUserId(1);

        assertEquals(1, result.getId());

        // verify that the method was actually called
        verify(patientRepository).findByUserId(1);
    }

    @Test
    void getPatientByUserId_throwsIfNotFound() {
        when(patientRepository.findByUserId(99)).thenReturn(null);

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            patientService.getPatientByUserId(99);
        });

        // check for exception thrown in service layer.
        assertTrue(ex.getMessage().contains("userId 99"));
        verify(patientRepository).findByUserId(99);
    }

    @Test
    void isEmpty_returnsFalse(){
        when(patientRepository.count()).thenReturn(1L);
        boolean result = patientService.isEmpty();
        assertFalse(result);
    }

    @Test
    void isEmpty_returnsTrue(){
        when(patientRepository.count()).thenReturn(0L);
        boolean result = patientService.isEmpty();
        assertTrue(result);
    }

    @Test
    void getAllPatients_returnsPatients() {
        Patient mockPatient = new Patient();
        mockPatient.setId(1);

        List<Patient> patients = List.of(mockPatient);
        when(patientRepository.findAll()).thenReturn(patients);

        List<Patient> result = patientService.getAllPatients();

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getId());
        verify(patientRepository).findAll();
    }

    @Test
    void createPatient_successfullyCreatesPatient() {
        // Arrange
        int userId = 1;
        int pharmacyId = 2;
        String phone = "123-456-7890";
        String address = "123 Main St";

        User mockUser = new User();
        mockUser.setUserId(userId);
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockUser.setEmail("john@example.com");

        Pharmacy mockPharmacy = new Pharmacy();
        mockPharmacy.setId(pharmacyId);

        Patient savedPatient = new Patient();
        savedPatient.setId(100);

        PatientPharmacy savedPatientPharmacy = new PatientPharmacy();
        savedPatientPharmacy.setId(pharmacyId);
        savedPatientPharmacy.setPharmacy(mockPharmacy);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(pharmacyRepository.findById(pharmacyId)).thenReturn(Optional.of(mockPharmacy));
        when(patientRepository.save(any(Patient.class))).thenReturn(savedPatient);
        when(patientPharmacyRepository.save(any(PatientPharmacy.class))).thenReturn(savedPatientPharmacy);

        // Act
        Patient result = patientService.createPatient(userId, phone, address, pharmacyId);

        // Assert
        assertEquals(100, result.getId());
        verify(userRepository).findById(userId);
        verify(pharmacyRepository).findById(pharmacyId);

        verify(patientPharmacyRepository).save(any(PatientPharmacy.class));
        verify(patientRepository).save(any(Patient.class));
    }


    @Test
    void updatePatientChart_createsNewChart_whenNoneExists() {
        // Arrange
        PatientChartRequest dto = new PatientChartRequest();
        dto.setPatientId(1);
        dto.setAge(30);
        dto.setWeight(70f);
        dto.setHeight(180f);
        dto.setSex("M");

        when(patientChartRepository.findByPatientId(1)).thenReturn(Optional.empty());

        PatientChart expectedChart = PatientChart.builder()
                .id(42)
                .patient(Patient.builder().id(1).build())
                .age(30)
                .weight(70f)
                .height(180f)
                .sex("M")
                .createTimestamp(LocalDateTime.now())
                .build();

        when(patientChartRepository.save(any(PatientChart.class))).thenReturn(expectedChart);

        // Act
        PatientChart result = patientService.updatePatientChart(dto);

        // Assert
        assertEquals(42, result.getId());
        assertEquals(30, result.getAge());
        assertEquals(70f, result.getWeight());
        assertEquals(180f, result.getHeight());
        assertEquals("M", result.getSex());
        verify(patientChartRepository).save(any(PatientChart.class));
    }

    @Test
    void updatePatientChart_updatesExistingChart() {
        // Arrange
        PatientChart existingChart = PatientChart.builder()
                .id(101)
                .patient(Patient.builder().id(1).build())
                .age(25)
                .weight(65f)
                .height(175f)
                .sex("F")
                .build();

        when(patientChartRepository.findByPatientId(1)).thenReturn(Optional.of(existingChart));

        PatientChartRequest dto = new PatientChartRequest();
        dto.setPatientId(1);
        dto.setAge(26);
        dto.setWeight(68f);
        dto.setHeight(176f);
        dto.setSex("F");

        PatientChart updatedChart = PatientChart.builder()
                .id(101)
                .patient(Patient.builder().id(1).build())
                .age(26)
                .weight(68f)
                .height(176f)
                .sex("F")
                .updateTimestamp(LocalDateTime.now())
                .build();

        when(patientChartRepository.save(any(PatientChart.class))).thenReturn(updatedChart);

        // Act
        PatientChart result = patientService.updatePatientChart(dto);

        // Assert
        assertEquals(101, result.getId());
        assertEquals(26, result.getAge());
        assertEquals(68f, result.getWeight());
        assertEquals(176f, result.getHeight());
        assertEquals("F", result.getSex());
        verify(patientChartRepository).save(any(PatientChart.class));
    }

}
