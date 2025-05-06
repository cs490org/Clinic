package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.AppointmentDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentStatusCodeRepository appointmentStatusCodeRepository;

    @Mock
    private AppointmentSymptomsRepository appointmentSymptomsRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    void getAllAppointments_returnsAllAppointments() {
        Appointment appointment1 = new Appointment();
        appointment1.setId(1);
        Appointment appointment2 = new Appointment();
        appointment2.setId(2);
        List<Appointment> expectedAppointments = Arrays.asList(appointment1, appointment2);

        when(appointmentRepository.findAll()).thenReturn(expectedAppointments);

        List<AppointmentDTO> result = appointmentService.getAllAppointments();

        assertEquals(2, result.size());
        verify(appointmentRepository).findAll();
    }

    @Test
    void createAppointment_successfullyCreatesAppointment() {
        Appointment appointment = new Appointment();
        appointment.setId(1);
        String symptomsDescription = "Fever and cough";

        AppointmentStatusCode pendingStatus = new AppointmentStatusCode();
        pendingStatus.setStatus("PENDING");
        when(appointmentStatusCodeRepository.findByStatus("PENDING")).thenReturn(pendingStatus);

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        appointmentService.createAppointment(appointment, symptomsDescription);

        verify(appointmentRepository).save(any(Appointment.class));
        verify(appointmentStatusCodeRepository).findByStatus("PENDING");
        verify(appointmentSymptomsRepository).save(any(AppointmentSymptoms.class));
    }

    @Test
    void createAppointment_successfullyCreatesAppointmentWithoutSymptoms() {
        Appointment appointment = new Appointment();
        appointment.setId(1);

        AppointmentStatusCode pendingStatus = new AppointmentStatusCode();
        pendingStatus.setStatus("PENDING");
        when(appointmentStatusCodeRepository.findByStatus("PENDING")).thenReturn(pendingStatus);

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        appointmentService.createAppointment(appointment, null);

        verify(appointmentRepository).save(any(Appointment.class));
        verify(appointmentStatusCodeRepository).findByStatus("PENDING");
        verify(appointmentSymptomsRepository, never()).save(any(AppointmentSymptoms.class));
    }

    @Test
    void createAppointment_successfullyCreatesAppointmentWithEmptySymptoms() {
        Appointment appointment = new Appointment();
        appointment.setId(1);

        AppointmentStatusCode pendingStatus = new AppointmentStatusCode();
        pendingStatus.setStatus("PENDING");
        when(appointmentStatusCodeRepository.findByStatus("PENDING")).thenReturn(pendingStatus);

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        appointmentService.createAppointment(appointment, "   ");

        verify(appointmentRepository).save(any(Appointment.class));
        verify(appointmentStatusCodeRepository).findByStatus("PENDING");
        verify(appointmentSymptomsRepository, never()).save(any(AppointmentSymptoms.class));
    }
} 