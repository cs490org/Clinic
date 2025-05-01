package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Drug;
import com.cs490.group4.demo.dto.DrugDTO;
import com.cs490.group4.demo.service.DrugService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@DependsOn("dataInitializer")
public class MockDrug {
    private final DrugService drugService;
    public Drug createMockDrug(String name, String description, String dosage, BigDecimal price) {
        DrugDTO dto = new DrugDTO();
        dto.setName(name);
        dto.setDescription(description);
        dto.setDosage(dosage);
        dto.setPrice(price);
        return drugService.createDrug(dto);
    }
}
