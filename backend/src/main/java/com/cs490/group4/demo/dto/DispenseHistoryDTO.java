package com.cs490.group4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DispenseHistoryDTO {
    private Integer quantity;
    private LocalDateTime dispensedAt;

    // Getters and Setters
}