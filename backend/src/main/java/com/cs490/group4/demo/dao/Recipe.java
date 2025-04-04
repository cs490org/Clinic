package com.cs490.group4.demo.dao;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Recipe {

    @Id
    @GeneratedValue
    private Integer id;

    private String name, description, instructions;


//    private String img_uri;

//    @ManyToMany
//    @JoinTable(
//            name = "recipe_owner",
//            joinColumns = @JoinColumn(name="recipe_id"),
//            inverseJoinColumns = @JoinColumn(name="user_id")
//
//    )
//    private List<User> author;

    private LocalDateTime createTimestamp, updateTimestamp;

}