package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import com.example.backend.model.Fine;
import com.example.backend.model.User;
import com.example.backend.repository.FineRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*") 
public class DriverController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FineRepository fineRepository;

    // INJECT THE SMS SERVICE HERE
    @Autowired
    private SmsService smsService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return Map.of(
                "token", "fake-jwt-token",
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "licenseNumber", user.getLicenseNumber() != null ? user.getLicenseNumber() : "",
                "role", user.getRole() != null ? user.getRole() : "driver"
        );
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");
        String name = data.get("name");
        String phone = data.get("phone");
        String licenseNumber = data.get("licenseNumber");

        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(password);
        newUser.setName(name);
        newUser.setPhone(phone);
        newUser.setLicenseNumber(licenseNumber);
        newUser.setRole("driver");

        User savedUser = userRepository.save(newUser);

        return Map.of(
                "message", "Registration successful",
                "id", savedUser.getId(),
                "name", savedUser.getName()
        );
    }

    @GetMapping("/fines/search")
    public Fine searchFine(@RequestParam String ref, @RequestParam String cat) {
        List<Fine> fines = fineRepository.findByReferenceNumberAndCategory(ref, cat);
        if (fines.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found");
        return fines.get(0);
    }

    @GetMapping("/fines")
    public List<Fine> getDriverFines(@RequestParam String licenseNumber) {
        return fineRepository.findByLicenseNumber(licenseNumber);
    }

    // UPDATED PAYMENT ENDPOINT WITH SMS INTEGRATION
    @PostMapping("/fines/{id}/pay")
    public Map<String, Object> payFine(
            @PathVariable Long id,
            @RequestBody Map<String, String> paymentData) {
        
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));

        // 1. Update fine status to PAID
        fine.setStatus("PAID");
        fineRepository.save(fine);

        // 2. Trigger SMS Notification to Officer via Service Architecture
        String officerPhone = "+94710000000"; // Mock officer phone
        String message = "Traffic Fine Ref: " + fine.getReferenceNumber() + 
                         " has been successfully PAID by driver. You may return the license.";
        smsService.sendSms(officerPhone, message);

        return Map.of(
                "message", "Payment successful",
                "fineId", fine.getId(),
                "status", fine.getStatus(),
                "amount", fine.getAmount()
        );
    }
}