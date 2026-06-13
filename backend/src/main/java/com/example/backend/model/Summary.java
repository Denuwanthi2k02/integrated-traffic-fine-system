package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "summary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Summary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long totalRevenue;
    private Long totalFines;
    private Long pendingFines;
    private Long settledFines;
    private String topViolation;
    private Double revenueGrowth;
    private Double fineGrowth;
}
