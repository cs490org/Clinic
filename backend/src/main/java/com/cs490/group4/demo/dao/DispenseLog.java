package com.cs490.group4.demo.dao;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import com.cs490.group4.demo.security.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DispenseLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer pharmacyId, drugId, quantity;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dispensedAt;

    @PrePersist
    public void prePersist() {
        this.dispensedAt = LocalDateTime.now();
    }
}