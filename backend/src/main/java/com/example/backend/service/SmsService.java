package com.example.backend.service;

public interface SmsService {
    void sendSms(String phoneNumber, String message);
}