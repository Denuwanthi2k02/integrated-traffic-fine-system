package com.example.backend.service;

import java.util.List;

import com.example.backend.model.CategoryStat;
import com.example.backend.model.DistrictStat;
import com.example.backend.model.Fine;
import com.example.backend.model.MonthlyTrend;
import com.example.backend.model.Summary;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryStatRepository;
import com.example.backend.repository.DistrictStatRepository;
import com.example.backend.repository.FineRepository;
import com.example.backend.repository.MonthlyTrendRepository;
import com.example.backend.repository.SummaryRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder {

    private final SummaryRepository summaryRepository;
    private final DistrictStatRepository districtStatRepository;
    private final CategoryStatRepository categoryStatRepository;
    private final MonthlyTrendRepository monthlyTrendRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    public DatabaseSeeder(
            SummaryRepository summaryRepository,
            DistrictStatRepository districtStatRepository,
            CategoryStatRepository categoryStatRepository,
            MonthlyTrendRepository monthlyTrendRepository,
            FineRepository fineRepository,
            UserRepository userRepository
    ) {
        this.summaryRepository = summaryRepository;
        this.districtStatRepository = districtStatRepository;
        this.categoryStatRepository = categoryStatRepository;
        this.monthlyTrendRepository = monthlyTrendRepository;
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin", "admin123", "Admin User", "ADMIN"));
        }

        if (summaryRepository.count() == 0) {
            summaryRepository.save(new Summary(null, 4218500L, 3847L, 641L, 3206L, "Speeding", 12.4, 8.1));
        }

        if (districtStatRepository.count() == 0) {
            districtStatRepository.saveAll(List.of(
                    new DistrictStat(null, "Colombo", 1100000L, 980L, 832L, 148L),
                    new DistrictStat(null, "Gampaha", 780000L, 712L, 601L, 111L),
                    new DistrictStat(null, "Kandy", 620000L, 543L, 471L, 72L),
                    new DistrictStat(null, "Kurunegala", 480000L, 421L, 358L, 63L),
                    new DistrictStat(null, "Galle", 360000L, 310L, 265L, 45L),
                    new DistrictStat(null, "Jaffna", 290000L, 248L, 211L, 37L),
                    new DistrictStat(null, "Matara", 210000L, 187L, 156L, 31L)
            ));
        }

        if (categoryStatRepository.count() == 0) {
            categoryStatRepository.saveAll(List.of(
                    new CategoryStat(null, "Speeding", 1616L, 1616000L, 3000L),
                    new CategoryStat(null, "No License", 923L, 1153750L, 5000L),
                    new CategoryStat(null, "Illegal Parking", 693L, 346500L, 1500L),
                    new CategoryStat(null, "Drunk Driving", 385L, 962500L, 25000L),
                    new CategoryStat(null, "Using Phone", 154L, 77000L, 3000L),
                    new CategoryStat(null, "No Seatbelt", 76L, 38000L, 1000L)
            ));
        }

        if (monthlyTrendRepository.count() == 0) {
            monthlyTrendRepository.saveAll(List.of(
                    new MonthlyTrend(null, "Jan", 1, 2800000L, 2410L),
                    new MonthlyTrend(null, "Feb", 2, 3100000L, 2680L),
                    new MonthlyTrend(null, "Mar", 3, 2950000L, 2530L),
                    new MonthlyTrend(null, "Apr", 4, 3400000L, 2920L),
                    new MonthlyTrend(null, "May", 5, 3750000L, 3210L),
                    new MonthlyTrend(null, "Jun", 6, 4218500L, 3847L)
            ));
        }

        if (fineRepository.count() == 0) {
            fineRepository.saveAll(List.of(
                    new Fine("TF-20260611-4821", "Speeding", "Colombo", 3000, "2026-06-11", "paid", "SI Perera"),
                    new Fine("TF-20260611-4820", "No License", "Gampaha", 5000, "2026-06-11", "paid", "SGT Fernando"),
                    new Fine("TF-20260611-4819", "Illegal Parking", "Kandy", 1500, "2026-06-11", "pending", "PC Silva"),
                    new Fine("TF-20260610-4818", "Drunk Driving", "Colombo", 25000, "2026-06-10", "paid", "SI Jayawardena"),
                    new Fine("TF-20260610-4817", "Speeding", "Galle", 3000, "2026-06-10", "pending", "SGT Wijeratne")
            ));
        }
    }
}
