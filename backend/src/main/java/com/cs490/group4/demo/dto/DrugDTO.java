package com.cs490.group4.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DrugDTO {
    private String name;
    private String description;
    private String dosage;
    private BigDecimal price;
    private String image;
}
