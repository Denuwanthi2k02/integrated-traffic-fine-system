import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../theme.dart';
import '../widgets/common_widgets.dart';
import 'home_screen.dart';
import '../services/api_service.dart';

class SuccessScreen extends StatelessWidget {
  final FineModel fine;
  final String transactionId;

  const SuccessScreen({
    super.key,
    required this.fine,
    required this.transactionId,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final dateStr =
        '${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}  ${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';

    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const SizedBox(height: 20),

                    // ── Success icon ──
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: AppTheme.successBg,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check_circle_rounded,
                          color: AppTheme.success, size: 44),
                    ),
                    const SizedBox(height: 16),
                    const Text('Payment Successful!',
                        style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primary)),
                    const SizedBox(height: 8),
                    Text(
                      'An SMS has been sent to ${fine.officerName}.\nYou may retrieve your driving license.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontSize: 13.5, color: AppTheme.textMuted, height: 1.5),
                    ),

                    const SizedBox(height: 28),

                    // ── Receipt card ──
                    SurfaceCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('PAYMENT RECEIPT',
                                  style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.textMuted,
                                      letterSpacing: 0.6)),
                              StatusBadge(status: 'paid'),
                            ],
                          ),
                          const SizedBox(height: 14),
                          const Divider(
                              height: 1,
                              thickness: 0.5,
                              color: AppTheme.border),
                          const SizedBox(height: 14),
                          InfoRow(
                              label: 'Transaction ID',
                              value: transactionId,
                              bold: true),
                          InfoRow(
                              label: 'Fine Reference',
                              value: fine.referenceNumber),
                          InfoRow(
                              label: 'Violation',
                              value: fine.categoryName),
                          InfoRow(label: 'Vehicle', value: fine.vehicleNumber),
                          InfoRow(label: 'District', value: fine.district),
                          InfoRow(label: 'Officer', value: fine.officerName),
                          InfoRow(label: 'Date & Time', value: dateStr),
                          const Divider(
                              height: 1,
                              thickness: 0.5,
                              color: AppTheme.border),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Total Paid',
                                  style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.primary)),
                              Text(
                                'Rs. ${fine.amount.toStringAsFixed(0).replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (m) => ',')}',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.success,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // ── SMS notice ──
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.successBg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                            color: AppTheme.success.withOpacity(0.3),
                            width: 0.8),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.sms_rounded,
                              color: AppTheme.success, size: 18),
                          SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'SMS notification sent to the traffic officer. Please collect your driving license.',
                              style: TextStyle(
                                  fontSize: 12.5, color: AppTheme.success),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Bottom button ──
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
              child: ElevatedButton.icon(
                icon: const Icon(Icons.home_rounded, size: 18),
                label: const Text('Back to Home'),
                onPressed: () async {
                  final name = await ApiService.getUserName() ?? 'Driver';
                  if (!context.mounted) return;
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                        builder: (_) => HomeScreen(userName: name)),
                    (_) => false,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}