package com.cs490.group4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientChartRequest {

    private Integer patientId, age;
    private Float weight, height;
    private String sex;

}
