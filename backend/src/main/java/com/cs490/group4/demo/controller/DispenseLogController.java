package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dto.DispenseHistoryDTO;
import com.cs490.group4.demo.dto.DispenseLogRequest;
import com.cs490.group4.demo.dao.DispenseLog;
import com.cs490.group4.demo.service.DispenseLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/dispenselog")
public class DispenseLogController {

    private final DispenseLogService dispenseLogService;

    public DispenseLogController(DispenseLogService dispenseLogService) {
        this.dispenseLogService = dispenseLogService;
    }

    @PostMapping("/log")
    public ResponseEntity<DispenseLog> logDispense(@RequestBody DispenseLogRequest request) {
        DispenseLog dispenseLog = dispenseLogService.saveDispenseLog(
            request.getPharmacyId(),
            request.getDrugId(),
            request.getQuantity()
        );
        return ResponseEntity.ok(dispenseLog);
    }

    @GetMapping("/dispense-history")
    public ResponseEntity<List<DispenseHistoryDTO>> getDispenseHistory(@RequestParam Integer pharmacyId, @RequestParam Integer drugId) {
        List<DispenseHistoryDTO> history = dispenseLogService.getDispenseHistory(pharmacyId, drugId);
        return ResponseEntity.ok(history);
    }
}
