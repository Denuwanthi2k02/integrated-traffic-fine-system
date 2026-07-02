package com.example.backend.repository;

import java.util.List;

import com.example.backend.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineRepository extends JpaRepository<Fine, String> {
    List<Fine> findAllByOrderByDateDesc();
    List<Fine> findByDistrictIgnoreCaseOrderByDateDesc(String district);
}
