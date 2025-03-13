package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class RecipeComment {

    @Id
    @GeneratedValue
    private Integer id;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "recipe_id", referencedColumnName = "user_id")
    private Recipe recipe;

    private LocalDateTime createTimestamp, updateTimestamp;

}