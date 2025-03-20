package com.cs490.group4.demo.security;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = RoleDeserializer.class)
public enum Role {

    PATIENT,
    DOCTOR,
    PHARMACIST,
    ADMIN;

}
