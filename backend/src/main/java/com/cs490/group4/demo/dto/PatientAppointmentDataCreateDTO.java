package com.cs490.group4.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientAppointmentDataCreateDTO {
    private Integer patientId;
    private Integer appointmentId;

    private LocalDateTime date;

    private Float waterIntake;
    private String bloodPressure;

    private Float height;
//    private Float weight; already in daily survey
}
