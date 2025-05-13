package com.cs490.group4.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthcheckController {

    @GetMapping("/healthcheck")
    private ResponseEntity<?> healthcheckEndpoint() {
        return ResponseEntity.ok("Up!");
    }

}
