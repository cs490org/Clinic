package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class PatientAppointmentData {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    // not using this, but storing just in case
    private Integer appointmentId;

    // date this data was logged.
    private LocalDateTime date;

    private Float waterIntake;
    private String bloodPressure;

    private Float height;
    private Float weight;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
