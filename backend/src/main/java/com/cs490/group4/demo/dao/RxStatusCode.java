package com.cs490.group4.demo.dao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RxStatusCode {

    @Id
    @GeneratedValue
    private Integer id;

    private String status;

    private LocalDateTime createTimestamp, updateTimestamp;
    

}