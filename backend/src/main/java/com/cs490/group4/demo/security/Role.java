package com.cs490.group4.demo.security;

public enum Role {

    PATIENT,
    DOCTOR,
    PHARMACIST;

    // left these in because authentication stuff relies on it
//    USER,
//    ADMIN

    public boolean isUser() {
        return this == PATIENT || this == DOCTOR;
    }

}
