package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByDoctorId(Integer doctorId);

    List<Appointment> findByAppointmentStatusCodeIdAndDoctorId(Integer statusCode, Integer doctorId);
}