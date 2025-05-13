package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.AppointmentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.Data;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.sql.Timestamp;

import jakarta.transaction.Transactional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentStatusCodeRepository appointmentStatusCodeRepository;

    @Autowired
    private AppointmentSymptomsRepository appointmentSymptomsRepository;

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointmentsForPatient(Integer patientId, Integer statusCode) {
        return appointmentRepository.findAll().stream().filter(a -> a.getPatient().getId().equals(patientId) && a.getAppointmentStatusCode().getId().equals(statusCode)).map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void createAppointment(Appointment appointment, String symptomsDescription) {
        appointment.setAppointmentStatusCode(appointmentStatusCodeRepository.findByStatus("PENDING"));

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Create and save the symptoms
        if (symptomsDescription != null && !symptomsDescription.trim().isEmpty()) {
            AppointmentSymptoms symptoms = new AppointmentSymptoms();
            symptoms.setAppointment(savedAppointment);
            symptoms.setDescription(symptomsDescription.trim());
            appointmentSymptomsRepository.save(symptoms);
        }
    }

    public boolean confirmAppointment(Integer appointmentId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isEmpty()) {
            return false;
        }

        Appointment appointment = optionalAppointment.get();

        if (!"PENDING".equals(appointment.getAppointmentStatusCode().getStatus())) {
            return false;
        }

        appointment.setAppointmentStatusCode(appointmentStatusCodeRepository.findByStatus("CONFIRMED"));
        appointmentRepository.save(appointment);
        return true;
    }

    public boolean rejectAppointment(Integer appointmentId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isEmpty()) {
            return false;
        }

        Appointment appointment = optionalAppointment.get();

        if ("CANCELLED".equals(appointment.getAppointmentStatusCode().getStatus())) {
            return false;
        }
        if ("COMPLETED".equals(appointment.getAppointmentStatusCode().getStatus())) {
            return false;
        }

        appointment.setAppointmentStatusCode(appointmentStatusCodeRepository.findByStatus("CANCELLED"));
        appointmentRepository.save(appointment);
        return true;
    }

    public List<AppointmentDTO> findByDoctorId(Integer doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<AppointmentDTO> findByStatusCodeIdAndDoctorId(Integer statusId, Integer doctorId) {
        return appointmentRepository.findByAppointmentStatusCodeIdAndDoctorId(statusId, doctorId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Appointment completeAppointment(Integer appointmentId){
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        appointment.setAppointmentStatusCode(AppointmentStatusCode.builder().id(4).build());
        return appointmentRepository.save(appointment);
    }

    private AppointmentDTO convertToDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setDoctor(appointment.getDoctor());
        dto.setPatient(appointment.getPatient());
        dto.setAppointmentStatusCode(appointment.getAppointmentStatusCode());
        dto.setAppointmentTimestamp(appointment.getAppointmentTimestamp());
        
        // Fetch and set symptoms
        List<AppointmentSymptoms> symptoms = appointmentSymptomsRepository.findByAppointmentId(appointment.getId());
        if (!symptoms.isEmpty()) {
            dto.setSymptoms(symptoms.get(0).getDescription());
        }
        
        return dto;
    }
}

