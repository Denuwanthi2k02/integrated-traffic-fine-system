package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.DistrictStat;

@Repository
public interface DistrictStatRepository extends JpaRepository<DistrictStat, Long> {
}
