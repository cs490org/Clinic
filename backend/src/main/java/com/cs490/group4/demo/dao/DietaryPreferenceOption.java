package com.cs490.group4.demo.dao;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DietaryPreferenceOption {

    @Id
    @GeneratedValue
    private Integer id;

    private LocalDateTime createTimestamp, updateTimestamp;

    private String diet;

}
