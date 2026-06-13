package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.CategoryStat;

@Repository
public interface CategoryStatRepository extends JpaRepository<CategoryStat, Long> {
}
