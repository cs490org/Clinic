package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.Drug;
import com.cs490.group4.demo.dto.DrugDTO;
import com.cs490.group4.demo.service.DrugService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drugs")
public class DrugController {

    private final DrugService drugService;

    public DrugController(DrugService drugService) {
        this.drugService = drugService;
    }

    @GetMapping
    public ResponseEntity<List<Drug>> getDrugs(){
        return ResponseEntity.ok(drugService.getDrugs());
    }
    @PostMapping
    public ResponseEntity<Drug> createDrug(@RequestBody DrugDTO dto) {
        Drug created = drugService.createDrug(dto);
        return ResponseEntity.ok(created);
    }
}
