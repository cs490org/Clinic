package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.dao.AppointmentSymptoms;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentSymptomsRepository extends JpaRepository<AppointmentSymptoms, Integer> {
    List<AppointmentSymptoms> findByAppointmentId(Integer appointmentId);
} 