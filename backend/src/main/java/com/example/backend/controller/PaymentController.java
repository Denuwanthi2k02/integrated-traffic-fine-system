package com.example.backend.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.backend.model.Fine;
import com.example.backend.repository.FineRepository;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private FineRepository fineRepository;

   
    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.currency}")
    private String currency;

    @Value("${sms.textlk.api.url}")
    private String smsApiUrl;

    @Value("${sms.textlk.api.token}")
    private String smsApiToken;

    @Value("${sms.textlk.sender.id}")
    private String smsSenderId;

   
    @GetMapping("/hash/{amount}/{orderId}")
    public ResponseEntity<String> generateHash(
            @PathVariable String amount,
            @PathVariable String orderId) {

        System.out.println("\n==============================");
        System.out.println("HASH GENERATION REQUEST");
        System.out.println("==============================");

        System.out.println("Received Amount : " + amount);
        System.out.println("Received Order ID : " + orderId);

        System.out.println("Merchant ID : " + merchantId);
        System.out.println("Currency : " + currency);

        // Format amount
        String formattedAmount = String.format("%.2f", Double.parseDouble(amount));

        System.out.println("Formatted Amount : " + formattedAmount);

        // MD5(secret)
        String hashedSecret = DigestUtils.md5Hex(merchantSecret).toUpperCase();

        System.out.println("Hashed Merchant Secret : " + hashedSecret);

        // PayHere hash
        String hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;

        System.out.println("HASH STRING : " + hashString);

        String hash = DigestUtils.md5Hex(hashString).toUpperCase();

        System.out.println("Generated HASH : " + hash);
        System.out.println("Returning HASH to Frontend");
        System.out.println("==============================\n");

        return ResponseEntity.ok(hash);
    }

    @PostMapping("/pay/{referenceNumber}")
    public ResponseEntity<?> paymentSuccess(
            @PathVariable String referenceNumber) {

        System.out.println("\n==============================");
        System.out.println("PAYMENT SUCCESS API CALLED");
        System.out.println("==============================");

        System.out.println("Reference Number : " + referenceNumber);

        Optional<Fine> fine = fineRepository.findByReferenceNumber(referenceNumber);

        if (fine.isPresent()) {
            System.out.println("Fine Found in Database");
            Fine f = fine.get();
            System.out.println("Current Status : " + f.getStatus());

            // Check if already paid to prevent duplicate SMS
            boolean alreadyPaid = "paid".equalsIgnoreCase(f.getStatus());

            if (!alreadyPaid) {
                f.setStatus("paid");
                fineRepository.save(f);
                System.out.println("Status Updated To : " + f.getStatus());
                System.out.println("Database Updated Successfully");
                
                // Send SMS to Police Officer
                sendSmsToOfficer(f);
            } else {
                System.out.println("Fine was already marked as paid. Skipping SMS.");
            }

            System.out.println("==============================\n");
            return ResponseEntity.ok(Map.of("message", "Payment successful"));
        }

        System.out.println("Fine NOT Found");
        System.out.println("==============================\n");
        return ResponseEntity.status(404).body(Map.of("message", "Fine not found"));
    }

    @PostMapping("/notify")
    public ResponseEntity<?> notify(
            @RequestParam String merchant_id,
            @RequestParam String order_id,
            @RequestParam String payhere_amount,
            @RequestParam String status_code) {

        System.out.println("\n==============================");
        System.out.println("PAYHERE NOTIFICATION RECEIVED");
        System.out.println("==============================");

        System.out.println("Merchant ID : " + merchant_id);
        System.out.println("Order ID : " + order_id);
        System.out.println("Payment Amount : " + payhere_amount);
        System.out.println("Status Code : " + status_code);

        if (status_code.equals("2")) {
            System.out.println("Payment Status : SUCCESS");

            Optional<Fine> fine = fineRepository.findByReferenceNumber(order_id);

            if (fine.isPresent()) {
                System.out.println("Matching Fine Found");
                Fine f = fine.get();
                System.out.println("Current Status : " + f.getStatus());

                
                boolean alreadyPaid = "paid".equalsIgnoreCase(f.getStatus());

                if (!alreadyPaid) {
                    f.setStatus("paid");
                    fineRepository.save(f);
                    System.out.println("Status Updated To : " + f.getStatus());
                    System.out.println("Database Updated Successfully");

                    // Send SMS to Police Officer
                    sendSmsToOfficer(f);
                } else {
                    System.out.println("Fine was already marked as paid. Skipping SMS.");
                }

            } else {
                System.out.println("No Fine Found For Order ID : " + order_id);
            }

        } else {
            System.out.println("Payment NOT Successful");
            System.out.println("No Database Update Performed");
        }

        System.out.println("Returning HTTP 200 to PayHere");
        System.out.println("==============================\n");

        return ResponseEntity.ok().build();
    }

    
    private void sendSmsToOfficer(Fine fine) {
        System.out.println("--- Initiating SMS to Police Officer ---");
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Setup Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            
          
            
            String recipientNumber = "94710000000"; 
            
            // Formulate the message
            String message = String.format(
                "Alert: The fine with Reference No: %s has been successfully paid.", 
                fine.getReferenceNumber()
            );

            // Create JSON Request Body using injected variables
            Map<String, Object> payload = new HashMap<>();
            payload.put("api_token", smsApiToken);
            payload.put("recipient", recipientNumber);
            payload.put("sender_id", smsSenderId);
            payload.put("type", "plain");
            payload.put("message", message);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            // Execute POST request using injected URL
            ResponseEntity<String> response = restTemplate.postForEntity(smsApiUrl, request, String.class);

            System.out.println("SMS Sent Successfully!");
            System.out.println("API Response: " + response.getBody());

        } catch (Exception e) {
            System.out.println("Failed to send SMS to Police Officer.");
            System.out.println("Error: " + e.getMessage());
        }
        System.out.println("----------------------------------------");
    }
}