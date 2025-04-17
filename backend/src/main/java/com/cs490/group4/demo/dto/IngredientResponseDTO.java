package com.cs490.group4.demo.dto;

import com.cs490.group4.demo.dao.Ingredient;
import lombok.Data;

@Data
public class IngredientResponseDTO {
    private Ingredient ingredient;
    private Integer quantity;
}
