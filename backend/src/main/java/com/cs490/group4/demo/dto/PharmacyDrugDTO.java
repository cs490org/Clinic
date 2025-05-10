// PharmacyDrugDTO.java
package com.cs490.group4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyDrugDTO {
    private Integer id; // inventory ID
    private String name;
    private String description;
    private String dosage;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private LocalDateTime expirationDate;
    private boolean dispensed; // optional if you support this
}
