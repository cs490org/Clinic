package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class MealPlanOwner {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "mealplan_id", referencedColumnName = "id")
    private MealPlan mealPlan;

    @CreationTimestamp
    private LocalDateTime createTimestamp;

    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

}