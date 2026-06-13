package com.example.backend.model; // Must be under com.example.backend

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Fine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String referenceNumber;
    private String category;
    private Double amount;
}