package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Recipe {

    @Id
    @GeneratedValue
    private Integer id;

    private String name, description;

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