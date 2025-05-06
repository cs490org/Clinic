package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class DoctorReviewDTO {

    private Integer doctorId, patientId, rating;
    private String title, review;

}
