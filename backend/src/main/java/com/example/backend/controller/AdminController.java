package com.example.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", 4218500);
        summary.put("totalFines", 3847);
        summary.put("pendingFines", 641);
        summary.put("settledFines", 3206);
        summary.put("topViolation", "Speeding");
        summary.put("revenueGrowth", 12.4);
        summary.put("fineGrowth", 8.1);
        return summary;
    }

    @GetMapping("/districts")
    public List<Map<String, Object>> getDistricts() {
        return List.of(
            Map.of("name", "Colombo", "revenue", 1100000, "fines", 980, "settled", 832, "pending", 148),
            Map.of("name", "Gampaha", "revenue", 780000, "fines", 712, "settled", 601, "pending", 111),
            Map.of("name", "Kandy", "revenue", 620000, "fines", 543, "settled", 471, "pending", 72),
            Map.of("name", "Kurunegala", "revenue", 480000, "fines", 421, "settled", 358, "pending", 63),
            Map.of("name", "Galle", "revenue", 360000, "fines", 310, "settled", 265, "pending", 45),
            Map.of("name", "Jaffna", "revenue", 290000, "fines", 248, "settled", 211, "pending", 37),
            Map.of("name", "Matara", "revenue", 210000, "fines", 187, "settled", 156, "pending", 31)
        );
    }

    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return List.of(
            Map.of("name", "Speeding", "count", 1616, "revenue", 1616000, "fineAmount", 3000),
            Map.of("name", "No License", "count", 923, "revenue", 1153750, "fineAmount", 5000),
            Map.of("name", "Illegal Parking", "count", 693, "revenue", 346500, "fineAmount", 1500),
            Map.of("name", "Drunk Driving", "count", 385, "revenue", 962500, "fineAmount", 25000),
            Map.of("name", "Using Phone", "count", 154, "revenue", 77000, "fineAmount", 3000),
            Map.of("name", "No Seatbelt", "count", 76, "revenue", 38000, "fineAmount", 1000)
        );
    }

    @GetMapping("/monthly")
    public Map<String, Object> getMonthlyTrend() {
        return Map.of(
            "labels", List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun"),
            "revenue", List.of(2800000, 3100000, 2950000, 3400000, 3750000, 4218500),
            "fines", List.of(2410, 2680, 2530, 2920, 3210, 3847)
        );
    }

    @GetMapping("/transactions")
    public List<Map<String, Object>> getTransactions(@RequestParam(required = false) String district) {
        List<Map<String, Object>> transactions = List.of(
            Map.of("id", "TF-20260611-4821", "category", "Speeding", "district", "Colombo", "amount", 3000, "date", "2026-06-11", "status", "paid", "officer", "SI Perera"),
            Map.of("id", "TF-20260611-4820", "category", "No License", "district", "Gampaha", "amount", 5000, "date", "2026-06-11", "status", "paid", "officer", "SGT Fernando"),
            Map.of("id", "TF-20260611-4819", "category", "Illegal Parking", "district", "Kandy", "amount", 1500, "date", "2026-06-11", "status", "pending", "officer", "PC Silva"),
            Map.of("id", "TF-20260610-4818", "category", "Drunk Driving", "district", "Colombo", "amount", 25000, "date", "2026-06-10", "status", "paid", "officer", "SI Jayawardena"),
            Map.of("id", "TF-20260610-4817", "category", "Speeding", "district", "Galle", "amount", 3000, "date", "2026-06-10", "status", "pending", "officer", "SGT Wijeratne")
        );

        if (district == null || district.equalsIgnoreCase("all")) {
            return transactions;
        }

        return transactions.stream()
            .filter(tx -> district.equalsIgnoreCase((String) tx.get("district")))
            .toList();
    }
}
