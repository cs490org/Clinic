package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Appointment;
import com.cs490.group4.demo.dao.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.cs490.group4.demo.dao.AppointmentStatusCodeRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentStatusCodeRepository appointmentStatusCodeRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public void createAppointment(Appointment appointment) {
        appointment.setAppointmentStatusCode(appointmentStatusCodeRepository.findByStatus("PENDING"));
        appointmentRepository.save(appointment);
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

        if (!"PENDING".equals(appointment.getAppointmentStatusCode().getStatus())) {
            return false;
        }

        appointment.setAppointmentStatusCode(appointmentStatusCodeRepository.findByStatus("CANCELLED"));
        appointmentRepository.save(appointment);
        return true;
    }

    public List<Appointment> findByDoctorId(Integer doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> findByStatusCodeIdAndDoctorId(Integer statusId, Integer doctorId) {
        return appointmentRepository.findByAppointmentStatusCodeIdAndDoctorId(statusId, doctorId);
    }


}
