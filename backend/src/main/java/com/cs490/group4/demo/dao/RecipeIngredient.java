package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class RecipeIngredient {

    @Id
    @GeneratedValue
    private Integer id;

    // amount of that particular ingredient
    private Integer amount;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient;

    @ManyToOne
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    private LocalDateTime createTimestamp, updateTimestamp;

}