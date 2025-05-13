package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
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
    @JoinColumn(name = "recipe_id", referencedColumnName = "id" )
    private Recipe recipe;

    @CreationTimestamp
    private LocalDateTime createTimestamp;

    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

}