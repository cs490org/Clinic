package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Drug;
import com.cs490.group4.demo.dto.DrugDTO;
import com.cs490.group4.demo.service.DrugService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@DependsOn("dataInitializer")
public class MockDrug {

    private final DrugService drugService;

    public Drug createMockDrug(String name, String description, String dosage, BigDecimal price, String image) {
        DrugDTO dto = new DrugDTO();
        dto.setName(name);
        dto.setDescription(description);
        dto.setDosage(dosage);
        dto.setPrice(price);
        dto.setImage(image);
        return drugService.createDrug(dto);
    }
}
