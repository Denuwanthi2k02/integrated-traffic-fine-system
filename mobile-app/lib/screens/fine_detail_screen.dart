import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../theme.dart';
import '../widgets/common_widgets.dart';
import 'payment_screen.dart';

class FineDetailScreen extends StatelessWidget {
  final FineModel fine;
  const FineDetailScreen({super.key, required this.fine});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fine Details')),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Amount hero ──
                  SurfaceCard(
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.dangerBg,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            fine.category.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.danger,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                        AmountDisplay(amount: fine.amount.toDouble()),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.bg,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            fine.violationDetails,
                            style: const TextStyle(
                                fontSize: 12.5, color: AppTheme.textMuted),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Violation details ──
                  const SectionHeader(title: 'VIOLATION DETAILS'),
                  SurfaceCard(
                    child: Column(
                      children: [
                        InfoRow(label: 'Reference #', value: fine.referenceNumber, bold: true),
                        _divider(),
                        InfoRow(label: 'Violation Date', value: fine.date),
                        _divider(),
                        InfoRow(label: 'License Plate', value: fine.licensePlate, bold: true),
                        _divider(),
                        InfoRow(label: 'District', value: fine.district),
                        _divider(),
                        InfoRow(label: 'Payment Deadline', value: fine.paymentDeadline),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Officer details ──
                  const SectionHeader(title: 'ISSUING OFFICER'),
                  SurfaceCard(
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(22),
                          ),
                          child: const Icon(Icons.local_police_rounded,
                              color: AppTheme.primary, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(fine.officer,
                                style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.primary)),
                            Text('${fine.district} District',
                                style: const TextStyle(
                                    fontSize: 12, color: AppTheme.textMuted)),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Notice ──
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.warningBg,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                          color: AppTheme.warning.withOpacity(0.3),
                          width: 0.8),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.warning_amber_rounded,
                            color: AppTheme.warning, size: 16),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Upon successful payment, an SMS will be sent to the issuing officer and your driving license will be returned to you.',
                            style: TextStyle(
                                fontSize: 12, color: AppTheme.warning),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Bottom pay button ──
          Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            color: AppTheme.surface,
            child: ElevatedButton.icon(
              onPressed: fine.status.toUpperCase() == 'PAID'
                  ? null
                  : () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => PaymentScreen(fine: fine)),
                      ),
              icon: const Icon(Icons.payment_rounded, size: 18),
              label: Text(fine.status.toUpperCase() == 'PAID'
                  ? 'Already Paid'
                  : 'Pay ${fine.formattedAmount}'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _divider() => const Divider(
      height: 1, thickness: 0.5, color: AppTheme.border);
}