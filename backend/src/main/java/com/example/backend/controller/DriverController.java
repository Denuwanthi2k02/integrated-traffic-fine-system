package com.example.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.backend.model.Fine;
import com.example.backend.model.User;
import com.example.backend.repository.FineRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FineRepository fineRepository;

    // Driver Login Endpoint
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

    // Driver Registration Endpoint
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");
        String name = data.get("name");
        String phone = data.get("phone");
        String licenseNumber = data.get("licenseNumber");

        // Check if email already exists
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
                "token", "fake-jwt-token",
                "id", savedUser.getId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail()
        );
    }

    // Search Fine by Reference Number and Category
    @GetMapping("/fines/search")
    public Fine searchFine(
            @RequestParam String ref,
            @RequestParam String cat) {
        
        List<Fine> fines = fineRepository.findByReferenceNumberAndCategory(ref, cat);
        
        if (fines.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found");
        }
        
        return fines.get(0);
    }

    // Get all fines for a driver (by license number)
    @GetMapping("/fines")
    public List<Fine> getDriverFines(@RequestParam String licenseNumber) {
        return fineRepository.findByLicenseNumber(licenseNumber);
    }

    // Get specific fine by ID
    @GetMapping("/fines/{id}")
    public Fine getFine(@PathVariable Long id) {
        return fineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));
    }

    // Process Payment (update fine status)
    @PostMapping("/fines/{id}/pay")
    public Map<String, Object> payFine(
            @PathVariable Long id,
            @RequestBody Map<String, String> paymentData) {
        
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));

        // Update fine status
        fine.setStatus("PAID");
        fineRepository.save(fine);

        return Map.of(
                "message", "Payment successful",
                "fineId", fine.getId(),
                "status", fine.getStatus(),
                "amount", fine.getAmount(),
                "referenceNumber", fine.getReferenceNumber()
        );
    }

    // Get fine details for payment page
    @GetMapping("/fines/{id}/details")
    public Map<String, Object> getFineDetails(@PathVariable Long id) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));

        return Map.of(
                "id", fine.getId(),
                "referenceNumber", fine.getReferenceNumber(),
                "category", fine.getCategory(),
                "amount", fine.getAmount(),
                "status", fine.getStatus(),
                "driverName", fine.getDriverName() != null ? fine.getDriverName() : "",
                "licensePlate", fine.getLicensePlate() != null ? fine.getLicensePlate() : "",
                "violationDetails", fine.getViolationDetails() != null ? fine.getViolationDetails() : "",
                "date", fine.getDate(),
                "paymentDeadline", fine.getPaymentDeadline() != null ? fine.getPaymentDeadline() : ""
        );
    }
}
