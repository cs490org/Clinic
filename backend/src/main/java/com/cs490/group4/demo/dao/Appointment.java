package com.cs490.group4.demo.dao;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class Appointment {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "appointment_status_code_id", referencedColumnName = "id")
    private AppointmentStatusCode appointmentStatusCode;

    private Timestamp appointmentTimestamp, createTimestamp, updateTimestamp;

}