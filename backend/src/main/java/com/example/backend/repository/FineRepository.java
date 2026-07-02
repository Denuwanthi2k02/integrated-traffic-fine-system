package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findAllByOrderByDateDesc();
    List<Fine> findByDistrictIgnoreCaseOrderByDateDesc(String district);
    Optional<Fine> findByReferenceNumber(String referenceNumber);
    List<Fine> findByReferenceNumberAndCategory(String referenceNumber, String category);
    List<Fine> findByLicenseNumber(String licenseNumber);
}
