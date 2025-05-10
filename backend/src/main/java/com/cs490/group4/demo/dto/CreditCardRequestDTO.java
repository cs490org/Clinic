package com.cs490.group4.demo.dto;

import lombok.Data;

@Data
public class CreditCardRequestDTO {
    private Integer patientId;

    private String cardHolderName;
    private String cardNumber; // this gets encrypted

    private String expirationDate;
    private String billingAddress;
}
