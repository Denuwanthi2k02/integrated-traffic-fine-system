import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/fine_model.dart';

class ApiService {
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8080/api';
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8080/api';
    }
    return 'http://localhost:8080/api';
  }
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/driver/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception(_extractError(res, 'Invalid email or password'));
  }

  // Maps to: POST /api/driver/register
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String licenseNumber,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/driver/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'licenseNumber': licenseNumber,
      }),
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception(_extractError(res, 'Registration failed'));
  }

  static Future<void> saveSession({
    required String token,
    required String name,
    required String licenseNumber,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
    await prefs.setString('user_name', name);
    await prefs.setString('license_number', licenseNumber);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_name');
  }

  static Future<String?> getLicenseNumber() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('license_number');
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_name');
    await prefs.remove('license_number');
  }

  static Future<FineModel> lookupFine(
      String referenceNumber, String category) async {
    final uri = Uri.parse('$baseUrl/driver/fines/search').replace(
      queryParameters: {'ref': referenceNumber, 'cat': category},
    );

    final res = await http.get(uri);

    if (res.statusCode == 200) {
      return FineModel.fromJson(jsonDecode(res.body));
    }
    if (res.statusCode == 404) {
      throw Exception(
          'Fine not found. Check your reference number and category.');
    }
   
    throw Exception(
        'Server error (${res.statusCode}): ${res.body.isEmpty ? '<empty response>' : res.body}');
  }

  static Future<Map<String, dynamic>> processPayment(
      int fineId, PaymentModel payment) async {
    final res = await http.post(
      Uri.parse('$baseUrl/driver/fines/$fineId/pay'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'cardHolder': payment.cardHolder,
        'cardNumber': payment.cardNumber,
        'expiry': payment.expiry,
        'cvv': payment.cvv,
      }),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      data['transactionId'] =
          'TXN-$fineId-${DateTime.now().millisecondsSinceEpoch}';
      return data;
    }
    throw Exception(_extractError(res, 'Payment failed. Please try again.'));
  }
  
  static Future<List<FineModel>> getPaymentHistory() async {
    final licenseNumber = await getLicenseNumber();
    if (licenseNumber == null || licenseNumber.isEmpty) return [];

    final uri = Uri.parse('$baseUrl/driver/fines').replace(
      queryParameters: {'licenseNumber': licenseNumber},
    );

    final res = await http.get(uri);

    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list
          .map((e) => FineModel.fromJson(e as Map<String, dynamic>))
          .where((f) => f.status.toUpperCase() == 'PAID')
          .toList();
    }
    throw Exception('Could not load payment history.');
  }

  // Maps to: GET /api/payments/hash/{amount}/{orderId}
static Future<String> getPaymentHash(String amount, String orderId) async {
  final res = await http.get(
    Uri.parse('$baseUrl/payments/hash/$amount/$orderId'),
  );
  if (res.statusCode == 200) return res.body;
  throw Exception('Could not generate payment hash.');
}

// Maps to: POST /api/payments/pay/{referenceNumber}
static Future<void> confirmPayHerePayment(String referenceNumber) async {
  final res = await http.post(
    Uri.parse('$baseUrl/payments/pay/$referenceNumber'),
  );
  if (res.statusCode != 200) {
    throw Exception('Payment succeeded but could not be confirmed with the server.');
  }
}

  // ── helpers ──────────────────────────────────────────────────
  static String _extractError(http.Response res, String fallback) {
    try {
      final body = jsonDecode(res.body);
      if (body is Map && body['message'] != null) {
        return body['message'].toString();
      }
    } catch (_) {
      // response wasn't JSON (e.g. plain error page) — fall through
    }
    return fallback;
  }
}