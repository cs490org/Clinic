package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Drug;
import com.cs490.group4.demo.dao.DrugRepository;
import com.cs490.group4.demo.dto.DrugDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DrugService {

    private final DrugRepository drugRepository;

    public DrugService(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    public List<Drug> getDrugs(){
        return drugRepository.findAll();
    }
    public Drug createDrug(DrugDTO dto) {
        Drug drug = Drug.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .dosage(dto.getDosage())
                .price(dto.getPrice())
                .createTimestamp(LocalDateTime.now())
                .updateTimestamp(LocalDateTime.now())
                .build();

        return drugRepository.save(drug);
    }

    public boolean isEmpty(){
        return drugRepository.count() == 0;
    }
}
