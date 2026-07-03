package com.example.backend.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private SummaryRepository summaryRepository;

    @Autowired
    private DistrictStatRepository districtStatRepository;

    @Autowired
    private CategoryStatRepository categoryStatRepository;

    @Autowired
    private MonthlyTrendRepository monthlyTrendRepository;

    @Autowired
    private FineRepository fineRepository;

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
        List<String> labels = trends.stream().map(MonthlyTrend::getMonth).toList();
        List<Long> revenue = trends.stream().map(MonthlyTrend::getRevenue).toList();
        List<Long> fines = trends.stream().map(MonthlyTrend::getFines).toList();

        return Map.of(
                "labels", labels,
                "revenue", revenue,
                "fines", fines
        );
    }

    @GetMapping("/transactions")
    public List<Fine> getTransactions(
            @RequestParam(required = false, defaultValue = "all") String district,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false, defaultValue = "all") String month) {
        
        List<Fine> fines;
        
        if (district == null || district.trim().isEmpty() || district.equalsIgnoreCase("all")) {
            fines = fineRepository.findAllByOrderByDateDesc();
        } else {
            fines = fineRepository.findByDistrictIgnoreCaseOrderByDateDesc(district);
        }

        return fines.stream()
                .filter(fine -> status == null || "all".equalsIgnoreCase(status) || 
                        (fine.getStatus() != null && fine.getStatus().equalsIgnoreCase(status)))
                .filter(fine -> category == null || "all".equalsIgnoreCase(category) || 
                        (fine.getCategory() != null && fine.getCategory().equalsIgnoreCase(category)))
                .filter(fine -> month == null || "all".equalsIgnoreCase(month) || 
                        (fine.getDate() != null && fine.getDate().startsWith(month)))
                .collect(Collectors.toList());
    }

    // NEW: Endpoint to Issue a New Fine
    @PostMapping("/fines")
    public Fine issueFine(@RequestBody Fine fine) {
        // Automatically set status to PENDING for new fines
        fine.setStatus("PENDING");
        
        // If date is empty, set to today's date
        if (fine.getDate() == null || fine.getDate().isEmpty()) {
            fine.setDate(LocalDate.now().toString());
        }

        // Generate a 14-day payment deadline if not provided
        if (fine.getPaymentDeadline() == null || fine.getPaymentDeadline().isEmpty()) {
            fine.setPaymentDeadline(LocalDate.now().plusDays(14).toString());
        }

        return fineRepository.save(fine);
    }
}