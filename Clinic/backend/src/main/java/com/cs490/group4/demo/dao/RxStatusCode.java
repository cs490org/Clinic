package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.RoleDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@JsonDeserialize(using = RoleDeserializer.class)
public enum RxStatusCode {

    NEW_PRESCRIPTION,
    READY_FOR_PICKUP,
    FULFILLED

}