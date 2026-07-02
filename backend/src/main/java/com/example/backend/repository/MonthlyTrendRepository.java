package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.MonthlyTrend;

@Repository
public interface MonthlyTrendRepository extends JpaRepository<MonthlyTrend, Long> {
}
