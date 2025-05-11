package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditCard {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name="patient_id",referencedColumnName = "id")
    private Patient patient;

    private String cardHolderName;
//    private String cardNumber;
    private String encryptedCardNumber;
    private String last4Digits;

    private String expirationDate;
    private String billingAddress;

    // 3/4 digits on back
    // payment processor handles this
//    private String cvv;

    @CreationTimestamp
    private LocalDateTime createTimestamp;

    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

}
