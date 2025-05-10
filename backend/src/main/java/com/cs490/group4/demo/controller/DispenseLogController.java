package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.DispenseLog;
import com.cs490.group4.demo.service.DispenseLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dispenselog")
public class DispenseLogController {

    private final DispenseLogService dispenseLogService;

    public DispenseLogController(DispenseLogService dispenseLogService) {
        this.dispenseLogService = dispenseLogService;
    }

    @PostMapping
    public ResponseEntity<DispenseLog> logDispense(@RequestParam Integer pharmacyId, @RequestParam Integer drugId, @RequestParam Integer quantity) {
        DispenseLog dispenseLog = dispenseLogService.saveDispenseLog(pharmacyId, drugId, quantity);
        return ResponseEntity.ok(dispenseLog);
    }
}
