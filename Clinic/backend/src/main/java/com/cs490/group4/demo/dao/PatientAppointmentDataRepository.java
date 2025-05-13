package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface PatientAppointmentDataRepository  extends JpaRepository<PatientAppointmentData, Integer> {

//    Optional<PatientAppointmentData> findByPatientIdAndAppointmentId(Integer patientId, Integer appointmentId);
    Optional<PatientAppointmentData> findByPatient_IdAndAppointmentId(Integer patientId, Integer appointmentId);
    List<PatientAppointmentData> findByPatient_Id(Integer patientId);
}
