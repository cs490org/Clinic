package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DoctorService doctorService;

    @Test
    void getAllDoctors_returnsAllDoctors() {
        Doctor doctor1 = new Doctor();
        doctor1.setId(1);
        Doctor doctor2 = new Doctor();
        doctor2.setId(2);
        List<Doctor> expectedDoctors = Arrays.asList(doctor1, doctor2);

        when(doctorRepository.findAll()).thenReturn(expectedDoctors);

        List<Doctor> result = doctorService.getAllDoctors();

        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getId());
        assertEquals(2, result.get(1).getId());
        verify(doctorRepository).findAll();
    }

    @Test
    void getDoctorByUserId_returnsDoctor() {
        Doctor mockDoctor = new Doctor();
        mockDoctor.setId(1);
        when(doctorRepository.findByUserId(1)).thenReturn(mockDoctor);

        Doctor result = doctorService.getDoctorByUserId(1);

        assertEquals(1, result.getId());
        verify(doctorRepository).findByUserId(1);
    }

    @Test
    void getDoctorByUserId_throwsIfNotFound() {
        when(doctorRepository.findByUserId(99)).thenReturn(null);

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            doctorService.getDoctorByUserId(99);
        });

        assertTrue(ex.getMessage().contains("Doctor not found"));
        verify(doctorRepository).findByUserId(99);
    }

    @Test
    void createDoctor_successfullyCreatesDoctor() {
        User mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockUser.setEmail("john@example.com");

        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));

        Doctor savedDoctor = new Doctor();
        savedDoctor.setId(1);
        savedDoctor.setUser(mockUser);
        savedDoctor.setPhone("123-456-7890");
        savedDoctor.setSpecialty("Cardiology");
        savedDoctor.setLicenseNumber(12345L);

        when(doctorRepository.save(any(Doctor.class))).thenReturn(savedDoctor);

        Doctor result = doctorService.createDoctor(1, "123-456-7890", "Cardiology", 12345L);

        assertEquals(1, result.getId());
        assertEquals("123-456-7890", result.getPhone());
        assertEquals("Cardiology", result.getSpecialty());
        assertEquals(12345L, result.getLicenseNumber());
        verify(userRepository).findById(1);
        verify(doctorRepository).save(any(Doctor.class));
    }

    @Test
    void createDoctor_throwsIfUserNotFound() {
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            doctorService.createDoctor(99, "123-456-7890", "Cardiology", 12345L);
        });

        assertTrue(ex.getMessage().contains("User not found"));
        verify(userRepository).findById(99);
    }

    @Test
    void updateAcceptingStatus_successfullyUpdates() {
        Doctor mockDoctor = new Doctor();
        mockDoctor.setId(1);
        when(doctorRepository.findById(1)).thenReturn(Optional.of(mockDoctor));
        when(doctorRepository.save(any(Doctor.class))).thenReturn(mockDoctor);

        doctorService.updateAcceptingStatus(1, true);

        verify(doctorRepository).findById(1);
        verify(doctorRepository).save(any(Doctor.class));
    }

    @Test
    void updateAcceptingStatus_throwsIfDoctorNotFound() {
        when(doctorRepository.findById(99)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            doctorService.updateAcceptingStatus(99, true);
        });

        assertTrue(ex.getMessage().contains("Doctor not found"));
        verify(doctorRepository).findById(99);
    }
} 