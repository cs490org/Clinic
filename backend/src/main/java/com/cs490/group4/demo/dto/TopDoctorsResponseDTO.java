package com.cs490.group4.demo.dto;

import com.cs490.group4.demo.dao.Doctor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopDoctorsResponseDTO {

    private Doctor doctor;
    private Double rating;

}
