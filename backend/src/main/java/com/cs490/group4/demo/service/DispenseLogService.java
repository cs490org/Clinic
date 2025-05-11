package com.cs490.group4.demo.service;

import java.util.stream.Collectors;
import java.util.List;
import com.cs490.group4.demo.dto.DispenseHistoryDTO;
import com.cs490.group4.demo.dao.DispenseLog;
import com.cs490.group4.demo.dao.DispenseLogRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DispenseLogService {
    private final DispenseLogRepository dispenseLogRepository;

    // Method to save a dispense log
    public DispenseLog saveDispenseLog(Integer pharmacyId, Integer drugId, Integer quantity) {
        DispenseLog dispenseLog = DispenseLog.builder()
                .pharmacyId(pharmacyId)
                .drugId(drugId)
                .quantity(quantity)
                .build();
        return dispenseLogRepository.save(dispenseLog);
    }

    public List<DispenseHistoryDTO> getDispenseHistory(Integer pharmacyId, Integer drugId) {
            List<DispenseLog> logs = dispenseLogRepository.findByPharmacyIdAndDrugId(pharmacyId, drugId);
            return logs.stream()
                    .map(log -> new DispenseHistoryDTO(log.getQuantity(), log.getDispensedAt()))
                    .collect(Collectors.toList());
        }
}
