package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class CreditCardResponseDTO {
    private Integer id;
    private String last4Digits;
    private String expirationDate;
}

