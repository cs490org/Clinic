package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class EnrichedPatientDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
}
