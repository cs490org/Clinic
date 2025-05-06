package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ChosenDoctorServiceTest {

    @Mock private ChosenDoctorRepository chosenDoctorRepository;
    @InjectMocks private ChosenDoctorService chosenDoctorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getPatientsByDoctor_returnsCorrectPatients() {
        Doctor doctor = Doctor.builder().id(1).build();
        Patient patient1 = Patient.builder().id(10).build();
        Patient patient2 = Patient.builder().id(20).build();

        List<ChosenDoctor> data = List.of(
                ChosenDoctor.builder().doctor(doctor).patient(patient1).build(),
                ChosenDoctor.builder().doctor(Doctor.builder().id(2).build()).patient(patient2).build()
        );

        when(chosenDoctorRepository.findAll()).thenReturn(data);

        List<Patient> result = chosenDoctorService.getPatientsByDoctor(1);

        assertEquals(1, result.size());
        assertEquals(10, result.get(0).getId());
    }

    @Test
    void getChosenDoctorByPatientId_found() {
        ChosenDoctor cd = ChosenDoctor.builder()
                .patient(Patient.builder().id(1).build())
                .doctor(Doctor.builder().id(2).build())
                .build();

        when(chosenDoctorRepository.findByPatientId(1)).thenReturn(Optional.of(cd));

        ChosenDoctor result = chosenDoctorService.getChosenDoctorByPatientId(1);
        assertEquals(1, result.getPatient().getId());
    }

    @Test
    void getChosenDoctorByPatientId_notFound_throws() {
        when(chosenDoctorRepository.findByPatientId(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                chosenDoctorService.getChosenDoctorByPatientId(1));

        assertTrue(ex.getMessage().contains("Could not find patient with id"));
    }

    @Test
    void assignPatientToDoctor_createsNewAssignment() {
        when(chosenDoctorRepository.findByPatientId(1)).thenReturn(Optional.empty());

        ChosenDoctor toSave = ArgumentMatchers.any();
        ChosenDoctor saved = ChosenDoctor.builder()
                .patient(Patient.builder().id(1).build())
                .doctor(Doctor.builder().id(2).build())
                .createTimestamp(LocalDateTime.now())
                .build();

        when(chosenDoctorRepository.save(toSave)).thenReturn(saved);

        ChosenDoctor result = chosenDoctorService.assignPatientToDoctor(1, 2);
        assertEquals(1, result.getPatient().getId());
        assertEquals(2, result.getDoctor().getId());
        assertNotNull(result.getCreateTimestamp());
    }

    @Test
    void assignPatientToDoctor_updatesExistingAssignment() {
        ChosenDoctor existing = ChosenDoctor.builder()
                .id(100)
                .patient(Patient.builder().id(1).build())
                .doctor(Doctor.builder().id(99).build())
                .build();

        when(chosenDoctorRepository.findByPatientId(1)).thenReturn(Optional.of(existing));

        when(chosenDoctorRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ChosenDoctor result = chosenDoctorService.assignPatientToDoctor(1, 2);

        assertEquals(1, result.getPatient().getId());
        assertEquals(2, result.getDoctor().getId());
        assertEquals(100, result.getId());
        assertNotNull(result.getUpdateTimestamp());
    }

    @Test
    void deletePatientDoctor_deletesEntry() {
        doNothing().when(chosenDoctorRepository).deleteByPatientId(1);
        chosenDoctorService.deletePatientDoctor(1);
        verify(chosenDoctorRepository).deleteByPatientId(1);
    }
}
