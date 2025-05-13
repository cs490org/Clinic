package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.AppointmentDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.sql.Timestamp;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private AppointmentStatusCodeRepository appointmentStatusCodeRepository;
    @Mock private AppointmentSymptomsRepository appointmentSymptomsRepository;
    @InjectMocks private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllAppointments_returnsMappedDTOs() {
        Appointment appt = new Appointment();
        appt.setId(1);
        appt.setAppointmentStatusCode(new AppointmentStatusCode());

        when(appointmentRepository.findAll()).thenReturn(List.of(appt));
        when(appointmentSymptomsRepository.findByAppointmentId(1)).thenReturn(Collections.emptyList());

        List<AppointmentDTO> result = appointmentService.getAllAppointments();

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getId());
    }

    @Test
    void createAppointment_withSymptoms_savesBoth() {
        Appointment appt = new Appointment();
        appt.setId(1);

        AppointmentStatusCode pending = new AppointmentStatusCode();
        pending.setStatus("PENDING");

        when(appointmentStatusCodeRepository.findByStatus("PENDING")).thenReturn(pending);
        when(appointmentRepository.save(appt)).thenReturn(appt);

        appointmentService.createAppointment(appt, "Headache");

        assertEquals("PENDING", appt.getAppointmentStatusCode().getStatus());
        verify(appointmentRepository).save(appt);
        verify(appointmentSymptomsRepository).save(any(AppointmentSymptoms.class));
    }

    @Test
    void createAppointment_withoutSymptoms_savesOnlyAppointment() {
        Appointment appt = new Appointment();
        appt.setId(2);

        when(appointmentStatusCodeRepository.findByStatus("PENDING")).thenReturn(new AppointmentStatusCode());
        when(appointmentRepository.save(appt)).thenReturn(appt);

        appointmentService.createAppointment(appt, "");

        verify(appointmentRepository).save(appt);
        verify(appointmentSymptomsRepository, never()).save(any());
    }

    @Test
    void confirmAppointment_pending_succeeds() {
        AppointmentStatusCode pending = new AppointmentStatusCode(); pending.setStatus("PENDING");
        AppointmentStatusCode confirmed = new AppointmentStatusCode(); confirmed.setStatus("CONFIRMED");

        Appointment appt = new Appointment(); appt.setId(3); appt.setAppointmentStatusCode(pending);

        when(appointmentRepository.findById(3)).thenReturn(Optional.of(appt));
        when(appointmentStatusCodeRepository.findByStatus("CONFIRMED")).thenReturn(confirmed);

        boolean result = appointmentService.confirmAppointment(3);

        assertTrue(result);
        verify(appointmentRepository).save(appt);
        assertEquals("CONFIRMED", appt.getAppointmentStatusCode().getStatus());
    }

    @Test
    void confirmAppointment_notPending_fails() {
        AppointmentStatusCode other = new AppointmentStatusCode(); other.setStatus("CONFIRMED");
        Appointment appt = new Appointment(); appt.setId(4); appt.setAppointmentStatusCode(other);

        when(appointmentRepository.findById(4)).thenReturn(Optional.of(appt));

        boolean result = appointmentService.confirmAppointment(4);

        assertFalse(result);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void rejectAppointment_pending_succeeds() {
        AppointmentStatusCode pending = new AppointmentStatusCode(); pending.setStatus("PENDING");
        AppointmentStatusCode cancelled = new AppointmentStatusCode(); cancelled.setStatus("CANCELLED");

        Appointment appt = new Appointment(); appt.setId(5); appt.setAppointmentStatusCode(pending);

        when(appointmentRepository.findById(5)).thenReturn(Optional.of(appt));
        when(appointmentStatusCodeRepository.findByStatus("CANCELLED")).thenReturn(cancelled);

        boolean result = appointmentService.rejectAppointment(5);

        assertTrue(result);
        verify(appointmentRepository).save(appt);
        assertEquals("CANCELLED", appt.getAppointmentStatusCode().getStatus());
    }

    @Test
    void rejectAppointment_notPending_fails() {
        AppointmentStatusCode confirmed = new AppointmentStatusCode(); confirmed.setStatus("CONFIRMED");
        Appointment appt = new Appointment(); appt.setId(6); appt.setAppointmentStatusCode(confirmed);

        when(appointmentRepository.findById(6)).thenReturn(Optional.of(appt));

        boolean result = appointmentService.rejectAppointment(6);

        assertFalse(result);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void findByDoctorId_returnsMappedDTOs() {
        Appointment appt = new Appointment(); appt.setId(7); appt.setAppointmentStatusCode(new AppointmentStatusCode());

        when(appointmentRepository.findByDoctorId(1)).thenReturn(List.of(appt));
        when(appointmentSymptomsRepository.findByAppointmentId(7)).thenReturn(Collections.emptyList());

        List<AppointmentDTO> result = appointmentService.findByDoctorId(1);

        assertEquals(1, result.size());
        assertEquals(7, result.get(0).getId());
    }

    @Test
    void findByStatusCodeIdAndDoctorId_returnsMappedDTOs() {
        Appointment appt = new Appointment(); appt.setId(8); appt.setAppointmentStatusCode(new AppointmentStatusCode());

        when(appointmentRepository.findByAppointmentStatusCodeIdAndDoctorId(2, 3)).thenReturn(List.of(appt));
        when(appointmentSymptomsRepository.findByAppointmentId(8)).thenReturn(Collections.emptyList());

        List<AppointmentDTO> result = appointmentService.findByStatusCodeIdAndDoctorId(2, 3);

        assertEquals(1, result.size());
        assertEquals(8, result.get(0).getId());
    }
}
