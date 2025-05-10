package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.CreditCard;
import com.cs490.group4.demo.dto.CreditCardRequestDTO;
import com.cs490.group4.demo.dto.CreditCardResponseDTO;
import com.cs490.group4.demo.service.CreditCardService;
import org.springframework.stereotype.Component;

@Component
public class MockCreditCard {
    private final CreditCardService creditCardService;

    public MockCreditCard(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    public CreditCard createMockCreditCard(Integer patientId, String cardHolderName, String cardNumber, String expirationDate, String billingAddress) {
        CreditCardRequestDTO creditCardRequestDTO = new CreditCardRequestDTO();
        creditCardRequestDTO.setPatientId(patientId);
        creditCardRequestDTO.setCardHolderName(cardHolderName);
        creditCardRequestDTO.setCardNumber(cardNumber);
        creditCardRequestDTO.setExpirationDate(expirationDate);
        creditCardRequestDTO.setBillingAddress(billingAddress);
        return creditCardService.save(creditCardRequestDTO);
    }
}
