package com.example.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.CategoryStat;
import com.example.backend.model.DistrictStat;
import com.example.backend.model.Fine;
import com.example.backend.model.MonthlyTrend;
import com.example.backend.model.Summary;
import com.example.backend.repository.CategoryStatRepository;
import com.example.backend.repository.DistrictStatRepository;
import com.example.backend.repository.FineRepository;
import com.example.backend.repository.MonthlyTrendRepository;
import com.example.backend.repository.SummaryRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private SummaryRepository summaryRepository;
    @Autowired private DistrictStatRepository districtStatRepository;
    @Autowired private CategoryStatRepository categoryStatRepository;
    @Autowired private MonthlyTrendRepository monthlyTrendRepository;
    @Autowired private FineRepository fineRepository;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Summary summary = summaryRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new IllegalStateException("Summary data not available"));

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", summary.getTotalRevenue());
        response.put("totalFines", summary.getTotalFines());
        response.put("pendingFines", summary.getPendingFines());
        response.put("settledFines", summary.getSettledFines());
        response.put("topViolation", summary.getTopViolation());
        response.put("revenueGrowth", summary.getRevenueGrowth());
        response.put("fineGrowth", summary.getFineGrowth());
        return response;
    }

    @GetMapping("/districts")
    public List<DistrictStat> getDistricts() {
        return districtStatRepository.findAll(Sort.by(Sort.Direction.DESC, "revenue"));
    }

    @GetMapping("/categories")
    public List<CategoryStat> getCategories() {
        return categoryStatRepository.findAll(Sort.by(Sort.Direction.DESC, "revenue"));
    }

    @GetMapping("/monthly")
    public Map<String, Object> getMonthlyTrend() {
        List<MonthlyTrend> trends = monthlyTrendRepository.findAll(Sort.by("monthOrder"));
        return Map.of(
            "labels", trends.stream().map(MonthlyTrend::getMonth).toList(),
            "revenue", trends.stream().map(MonthlyTrend::getRevenue).toList(),
            "fines", trends.stream().map(MonthlyTrend::getFines).toList()
        );
    }

    // THIS IS THE CRITICAL PART FOR YOUR TRANSACTIONS
    @GetMapping("/transactions")
    public List<Fine> getTransactions(
            @RequestParam(required = false, defaultValue = "all") String district,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false, defaultValue = "all") String month) {
        
        // 1. Fetch from DB
        List<Fine> fines = fineRepository.findAllByOrderByDateDesc();

        // 2. Apply filters in memory
        return fines.stream()
                .filter(f -> district.equals("all") || f.getDistrict().equalsIgnoreCase(district))
                .filter(f -> status.equals("all") || f.getStatus().equalsIgnoreCase(status))
                .filter(f -> category.equals("all") || f.getCategory().equalsIgnoreCase(category))
                .filter(f -> month.equals("all") || (f.getDate() != null && f.getDate().startsWith(month)))
                .collect(Collectors.toList());
    }
}