package com.cs490.group4.demo.dto;

import com.cs490.group4.demo.dao.AppointmentStatusCode;
import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.Patient;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class AppointmentDTO {
    private Integer id;
    private Doctor doctor;
    private Patient patient;
    private AppointmentStatusCode appointmentStatusCode;
    private Timestamp appointmentTimestamp;
    private String symptoms;
}
