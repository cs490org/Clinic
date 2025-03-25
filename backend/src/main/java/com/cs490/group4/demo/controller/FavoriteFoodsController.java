package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.FavoriteFood;
import com.cs490.group4.demo.service.FavoriteFoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favoriteFood")
@RequiredArgsConstructor
public class FavoriteFoodsController {
    private final FavoriteFoodService favoriteFoodService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<FavoriteFood> getPatientFavoriteFood(@PathVariable Integer patientId) {
        FavoriteFood favoriteFood = favoriteFoodService.getFavoriteFoodByPatientId(patientId);
        return ResponseEntity.ok(favoriteFood);
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<FavoriteFood> setPatientFavoriteFood(@PathVariable Integer patientId, @RequestBody Integer ingredientId) {
        return ResponseEntity.ok(favoriteFoodService.setFavoriteFoodByPatientId(patientId, ingredientId));
    }

}
