package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dto.CreditCardRequestDTO;
import com.cs490.group4.demo.dto.CreditCardResponseDTO;
import com.cs490.group4.demo.service.CreditCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CreditCardController {
    private final CreditCardService creditCardService;

    // not getting patient id from security context :/ thisll work for now

    @GetMapping("/credit-cards")
    public ResponseEntity<List<CreditCardResponseDTO>> getCards(@RequestParam Integer patientId) {
        List<CreditCardResponseDTO> cards = creditCardService.findByPatient(patientId);
        return ResponseEntity.ok(cards);
    }


    @PostMapping("/credit-cards")
    public ResponseEntity<?> addCard(@RequestBody CreditCardRequestDTO dto) {
        creditCardService.save(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/credit-cards/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable Integer id) {
        creditCardService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
