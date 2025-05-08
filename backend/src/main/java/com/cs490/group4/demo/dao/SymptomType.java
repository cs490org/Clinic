package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.RoleDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = RoleDeserializer.class)
public enum SymptomType {

    PHYSICAL,
    MENTAL,
    NEUROLOGICAL,
    GASTROINTESTINAL,
    RESPIRATORY,
    OTHER,

}