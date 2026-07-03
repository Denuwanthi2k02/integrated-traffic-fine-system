package com.example.backend.service;

import org.springframework.stereotype.Service;

@Service
public class MockSmsServiceImpl implements SmsService {
    @Override
    public void sendSms(String phoneNumber, String message) {
        System.out.println("\n=== 📱 MOCK SMS GATEWAY ===");
        System.out.println("Sending SMS to: " + phoneNumber);
        System.out.println("Message: " + message);
        System.out.println("Status: SUCCESS");
        System.out.println("===========================\n");
    }
}