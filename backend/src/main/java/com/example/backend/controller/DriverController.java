package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.Fine;
import com.example.backend.model.User;
import com.example.backend.repository.FineRepository;
import com.example.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*") 
public class DriverController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FineRepository fineRepository;

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

    @PostMapping("/fines/{id}/pay")
    public Map<String, Object> payFine(
            @PathVariable Long id,
            @RequestBody Map<String, String> paymentData) {
        
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fine not found"));

        // 1. Update fine status to PAID
        fine.setStatus("PAID");
        fineRepository.save(fine);

        return Map.of(
                "message", "Payment successful",
                "fineId", fine.getId(),
                "status", fine.getStatus(),
                "amount", fine.getAmount()
        );
    }
}