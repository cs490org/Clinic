package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Drug;
import com.cs490.group4.demo.dao.DrugRepository;
import com.cs490.group4.demo.dto.DrugDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DrugServiceTest {

    @Mock
    private DrugRepository drugRepository;

    @InjectMocks
    private DrugService drugService;

    @Test
    void getDrugs_returnsAllDrugs() {
        Drug drug1 = new Drug();
        drug1.setId(1);
        Drug drug2 = new Drug();
        drug2.setId(2);
        List<Drug> expectedDrugs = Arrays.asList(drug1, drug2);

        when(drugRepository.findAll()).thenReturn(expectedDrugs);

        List<Drug> result = drugService.getDrugs();

        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getId());
        assertEquals(2, result.get(1).getId());
        verify(drugRepository).findAll();
    }

    @Test
    void createDrug_successfullyCreatesDrug() {
        DrugDTO dto = new DrugDTO();
        dto.setName("Test Drug");
        dto.setDescription("Test Description");
        dto.setDosage("10mg");
        dto.setPrice(new BigDecimal("9.99"));

        Drug savedDrug = Drug.builder()
                .id(1)
                .name(dto.getName())
                .description(dto.getDescription())
                .dosage(dto.getDosage())
                .price(dto.getPrice())
                .createTimestamp(LocalDateTime.now())
                .updateTimestamp(LocalDateTime.now())
                .build();

        when(drugRepository.save(any(Drug.class))).thenReturn(savedDrug);

        Drug result = drugService.createDrug(dto);

        assertEquals(1, result.getId());
        assertEquals("Test Drug", result.getName());
        assertEquals("Test Description", result.getDescription());
        assertEquals("10mg", result.getDosage());
        assertEquals(new BigDecimal("9.99"), result.getPrice());
        verify(drugRepository).save(any(Drug.class));
    }

    @Test
    void isEmpty_returnsTrue() {
        when(drugRepository.count()).thenReturn(0L);
        boolean result = drugService.isEmpty();
        assertTrue(result);
    }

    @Test
    void isEmpty_returnsFalse() {
        when(drugRepository.count()).thenReturn(1L);
        boolean result = drugService.isEmpty();
        assertFalse(result);
    }
} 