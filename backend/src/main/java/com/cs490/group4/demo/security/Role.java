package com.cs490.group4.demo.security;

public enum Role {

    PATIENT,
    DOCTOR,
    PHARMACIST,
    ADMIN;

    public boolean isUser() {
        return this == PATIENT || this == DOCTOR;
    }

}
