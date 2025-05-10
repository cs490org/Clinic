package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.CreditCard;
import com.cs490.group4.demo.dao.CreditCardRepository;
import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientRepository;
import com.cs490.group4.demo.dto.CreditCardRequestDTO;
import com.cs490.group4.demo.dto.CreditCardResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreditCardService {
    private final CreditCardRepository creditCardRepository;
    private final PatientRepository patientRepository;

    public List<CreditCardResponseDTO> findByPatient(Integer patientId) {

        return creditCardRepository.findByPatientId(patientId).stream().map((card)->{
            CreditCardResponseDTO dto = new CreditCardResponseDTO();
            dto.setId(card.getId());
            dto.setLast4Digits(card.getLast4Digits());
            dto.setExpirationDate(card.getExpirationDate());
            return dto;
        }).collect(Collectors.toList());
    }
    public void deleteById(Integer id) {
        creditCardRepository.deleteById(id);
    }

//    public CreditCard save(Patient patient, String plainCardNumber, String expirationDate) {
    public CreditCard save(CreditCardRequestDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId()).orElseThrow(() -> new EntityNotFoundException("Patient not found"));
        String plainCardNumber = dto.getCardNumber();
        String expirationDate = dto.getExpirationDate();

        String encryptedCardNumber = encrypt(plainCardNumber);
        String last4 = plainCardNumber.substring(plainCardNumber.length() - 4);

        CreditCard card = CreditCard.builder()
                .patient(patient)
                .encryptedCardNumber(encryptedCardNumber)
                .last4Digits(last4)
                .expirationDate(expirationDate)
                .build();

        return creditCardRepository.save(card);
    }

    // mock encryption
    private String encrypt(String data) {
        return Base64.getEncoder().encodeToString(data.getBytes());
    }
}
