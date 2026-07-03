// ─────────────────────────────────────────────────────────────
//  services/api_service.dart
//  Mock data layer — swap with real http calls when backend is ready
//  All real API calls are commented below each mock return
// ─────────────────────────────────────────────────────────────

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/fine_model.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8080/api'; // Android emulator localhost

  // ── Auth ─────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> login(
      String username, String password) async {
    await Future.delayed(const Duration(milliseconds: 700));

    // TODO: uncomment when backend ready
    // final res = await http.post(
    //   Uri.parse('$baseUrl/auth/login'),
    //   headers: {'Content-Type': 'application/json'},
    //   body: jsonEncode({'username': username, 'password': password}),
    // );
    // if (res.statusCode == 200) return jsonDecode(res.body);
    // throw Exception('Login failed');

    if (username == 'driver' && password == 'driver123') {
      return {
        'token': 'mock-jwt-token-driver-xyz',
        'name': 'Kasun Perera',
        'role': 'DRIVER',
      };
    }
    throw Exception('Invalid credentials');
  }

  static Future<void> saveToken(String token, String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
    await prefs.setString('user_name', name);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_name');
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_name');
  }

  // ── Fine lookup ──────────────────────────────────────────────

  static Future<FineModel> lookupFine(
      String referenceNumber, String categoryId) async {
    await Future.delayed(const Duration(milliseconds: 800));

    // TODO: uncomment when backend ready
    // final token = await getToken();
    // final res = await http.get(
    //   Uri.parse('$baseUrl/fines/lookup?ref=$referenceNumber&cat=$categoryId'),
    //   headers: {'Authorization': 'Bearer $token'},
    // );
    // if (res.statusCode == 200) return FineModel.fromJson(jsonDecode(res.body));
    // if (res.statusCode == 404) throw Exception('Fine not found');
    // throw Exception('Server error');

    // Mock fine database
    final mockFines = {
      'TF-2026-4821|CAT-001': FineModel(
        referenceNumber: 'TF-2026-4821',
        categoryId: 'CAT-001',
        categoryName: 'Speeding',
        amount: 3000,
        officerName: 'SI Nimal Perera',
        officerBadge: 'SI-4421',
        district: 'Colombo',
        violationDate: '2026-06-13',
        vehicleNumber: 'WP CAR-2021',
        status: 'pending',
        description:
            'Exceeding speed limit by 30 km/h in a school zone (70 km/h in 40 km/h zone)',
      ),
      'TF-2026-4820|CAT-002': FineModel(
        referenceNumber: 'TF-2026-4820',
        categoryId: 'CAT-002',
        categoryName: 'No License',
        amount: 5000,
        officerName: 'SGT Ruwan Fernando',
        officerBadge: 'SGT-2219',
        district: 'Gampaha',
        violationDate: '2026-06-13',
        vehicleNumber: 'WP CAB-3344',
        status: 'pending',
        description: 'Driver operating vehicle without a valid driving license',
      ),
      'TF-2026-4818|CAT-003': FineModel(
        referenceNumber: 'TF-2026-4818',
        categoryId: 'CAT-003',
        categoryName: 'Drunk Driving',
        amount: 25000,
        officerName: 'SI Amal Jayawardena',
        officerBadge: 'SI-1108',
        district: 'Colombo',
        violationDate: '2026-06-12',
        vehicleNumber: 'CP KAR-5512',
        status: 'pending',
        description:
            'Blood alcohol content above legal limit (0.12% vs 0.08% max)',
      ),
      'TF-2026-4819|CAT-004': FineModel(
        referenceNumber: 'TF-2026-4819',
        categoryId: 'CAT-004',
        categoryName: 'Illegal Parking',
        amount: 1500,
        officerName: 'PC Sunil Silva',
        officerBadge: 'PC-7734',
        district: 'Kandy',
        violationDate: '2026-06-12',
        vehicleNumber: 'KY VAN-8812',
        status: 'pending',
        description: 'Vehicle parked in a no-parking zone blocking traffic',
      ),
    };

    final key = '$referenceNumber|$categoryId';
    final fine = mockFines[key];
    if (fine == null) throw Exception('Fine not found. Check your reference number and category ID.');
    return fine;
  }

  // ── Payment ──────────────────────────────────────────────────

  static Future<Map<String, dynamic>> processPayment(
      PaymentModel payment) async {
    await Future.delayed(const Duration(milliseconds: 1500));

    // TODO: uncomment when backend ready
    // final token = await getToken();
    // final res = await http.post(
    //   Uri.parse('$baseUrl/payments/process'),
    //   headers: {
    //     'Authorization': 'Bearer $token',
    //     'Content-Type': 'application/json',
    //   },
    //   body: jsonEncode({
    //     'fineReference': payment.fineReference,
    //     'cardHolder': payment.cardHolder,
    //     'cardNumber': payment.cardNumber,
    //     'expiry': payment.expiry,
    //     'cvv': payment.cvv,
    //   }),
    // );
    // if (res.statusCode == 200) return jsonDecode(res.body);
    // throw Exception('Payment failed. Please try again.');

    return {
      'success': true,
      'transactionId': 'TXN-${DateTime.now().millisecondsSinceEpoch}',
      'message': 'Payment successful. Officer notified via SMS.',
      'timestamp': DateTime.now().toIso8601String(),
    };
  }

  // ── Payment history ──────────────────────────────────────────

  static Future<List<FineModel>> getPaymentHistory() async {
    await Future.delayed(const Duration(milliseconds: 600));

    // TODO: return real API data
    // final token = await getToken();
    // final res = await http.get(Uri.parse('$baseUrl/payments/history'),
    //   headers: {'Authorization': 'Bearer $token'});
    // final list = jsonDecode(res.body) as List;
    // return list.map((e) => FineModel.fromJson(e)).toList();

    return [
      FineModel(
        referenceNumber: 'TF-2026-4800',
        categoryId: 'CAT-001',
        categoryName: 'Speeding',
        amount: 3000,
        officerName: 'SI Nimal Perera',
        officerBadge: 'SI-4421',
        district: 'Colombo',
        violationDate: '2026-06-01',
        vehicleNumber: 'WP CAR-2021',
        status: 'paid',
        description: 'Exceeding speed limit',
      ),
      FineModel(
        referenceNumber: 'TF-2026-4755',
        categoryId: 'CAT-004',
        categoryName: 'Illegal Parking',
        amount: 1500,
        officerName: 'PC Sunil Silva',
        officerBadge: 'PC-7734',
        district: 'Kandy',
        violationDate: '2026-05-20',
        vehicleNumber: 'WP CAR-2021',
        status: 'paid',
        description: 'Parked in no-parking zone',
      ),
    ];
  }
}