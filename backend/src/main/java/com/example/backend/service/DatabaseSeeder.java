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
        // Seed Users (Admin + Driver users)
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@police.gov.lk");
            admin.setPassword("admin123");
            admin.setName("Admin User");
            admin.setRole("admin");
            userRepository.save(admin);

            // Sample driver users
            User driver1 = new User();
            driver1.setEmail("driver@example.com");
            driver1.setPassword("password123");
            driver1.setName("John Perera");
            driver1.setPhone("0771234567");
            driver1.setLicenseNumber("DL-20210045");
            driver1.setRole("driver");
            userRepository.save(driver1);

            User driver2 = new User();
            driver2.setEmail("test@example.com");
            driver2.setPassword("password123");
            driver2.setName("Test Driver");
            driver2.setPhone("0772345678");
            driver2.setLicenseNumber("DL-20210046");
            driver2.setRole("driver");
            userRepository.save(driver2);
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

        // Seed Fines with driver-relevant information
        if (fineRepository.count() == 0) {
            Fine fine1 = new Fine();
            fine1.setReferenceNumber("SLP-882291");
            fine1.setCategory("SPEED");
            fine1.setDistrict("Colombo");
            fine1.setAmount(3000);
            fine1.setDate("2026-06-11");
            fine1.setStatus("PENDING");
            fine1.setOfficer("SI Perera");
            fine1.setLicensePlate("WP ABC 1234");
            fine1.setLicenseNumber("DL-20210045");
            fine1.setDriverName("John Perera");
            fine1.setViolationDetails("Exceeded speed limit by 25 km/h");
            fine1.setPaymentDeadline("2026-07-11");
            fineRepository.save(fine1);

            Fine fine2 = new Fine();
            fine2.setReferenceNumber("SLP-882290");
            fine2.setCategory("DRUNK");
            fine2.setDistrict("Gampaha");
            fine2.setAmount(25000);
            fine2.setDate("2026-06-10");
            fine2.setStatus("PENDING");
            fine2.setOfficer("SGT Fernando");
            fine2.setLicensePlate("WP DEF 5678");
            fine2.setLicenseNumber("DL-20210046");
            fine2.setDriverName("Test Driver");
            fine2.setViolationDetails("Suspected driving under influence");
            fine2.setPaymentDeadline("2026-07-10");
            fineRepository.save(fine2);

            Fine fine3 = new Fine();
            fine3.setReferenceNumber("SLP-882289");
            fine3.setCategory("LICENSE");
            fine3.setDistrict("Kandy");
            fine3.setAmount(5000);
            fine3.setDate("2026-06-09");
            fine3.setStatus("PENDING");
            fine3.setOfficer("PC Silva");
            fine3.setLicensePlate("WP GHI 9012");
            fine3.setLicenseNumber("DL-20210047");
            fine3.setDriverName("Jane Smith");
            fine3.setViolationDetails("Driving with expired license");
            fine3.setPaymentDeadline("2026-07-09");
            fineRepository.save(fine3);

            Fine fine4 = new Fine();
            fine4.setReferenceNumber("SLP-882288");
            fine4.setCategory("SPEED");
            fine4.setDistrict("Colombo");
            fine4.setAmount(3000);
            fine4.setDate("2026-06-08");
            fine4.setStatus("PAID");
            fine4.setOfficer("SI Jayawardena");
            fine4.setLicensePlate("WP JKL 3456");
            fine4.setLicenseNumber("DL-20210048");
            fine4.setDriverName("Mike Johnson");
            fine4.setViolationDetails("Speeding in residential area");
            fine4.setPaymentDeadline("2026-07-08");
            fineRepository.save(fine4);
        }
    }
}
