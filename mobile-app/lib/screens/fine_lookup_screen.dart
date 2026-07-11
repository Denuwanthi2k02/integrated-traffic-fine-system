import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/common_widgets.dart';
import 'fine_detail_screen.dart';

class FineLookupScreen extends StatefulWidget {
  final String userName;
  const FineLookupScreen({super.key, required this.userName});

  @override
  State<FineLookupScreen> createState() => _FineLookupScreenState();
}

class _FineLookupScreenState extends State<FineLookupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _refCtrl = TextEditingController();
  final _catCtrl = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _lookup() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final fine = await ApiService.lookupFine(
        _refCtrl.text.trim().toUpperCase(),
        _catCtrl.text.trim().toUpperCase(),
      );
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => FineDetailScreen(fine: fine)),
      );
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _refCtrl.dispose();
    _catCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Info banner ──
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                      color: const Color(0xFFBFDBFE), width: 0.8),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.info_outline_rounded,
                        color: Color(0xFF1D4ED8), size: 18),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('How to pay your fine',
                              style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1D4ED8))),
                          SizedBox(height: 4),
                          Text(
                            'Enter the reference number and category from your fine slip issued by the traffic officer.',
                            style: TextStyle(
                                fontSize: 12, color: Color(0xFF1E40AF)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ── Form ──
              const Text('Enter Fine Details',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.primary)),
              const SizedBox(height: 16),

              Form(
                key: _formKey,
                child: Column(
                  children: [
                    // Error message
                    if (_error != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.dangerBg,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(children: [
                          const Icon(Icons.error_outline,
                              color: AppTheme.danger, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                              child: Text(_error!,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      color: AppTheme.danger))),
                        ]),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Reference number
                    TextFormField(
                      controller: _refCtrl,
                      textCapitalization: TextCapitalization.characters,
                      decoration: const InputDecoration(
                        labelText: 'Fine Reference Number',
                        hintText: 'e.g. SLP-882291',
                        prefixIcon: Icon(Icons.tag_rounded,
                            color: AppTheme.textMuted, size: 20),
                       
                      ),
                      validator: (v) =>
                          v!.isEmpty ? 'Enter the reference number' : null,
                    ),
                    const SizedBox(height: 14),

                    // Category — must match the value stored in the DB
                    // (Fine.category), e.g. SPEED, DRUNK, LICENSE.
                    TextFormField(
                      controller: _catCtrl,
                      textCapitalization: TextCapitalization.characters,
                      decoration: const InputDecoration(
                        labelText: 'Category',
                        hintText: 'e.g. SPEED',
                        prefixIcon: Icon(Icons.category_outlined,
                            color: AppTheme.textMuted, size: 20),
                        
                      ),
                      validator: (v) =>
                          v!.isEmpty ? 'Enter the category' : null,
                    ),
                    const SizedBox(height: 24),

                    ElevatedButton.icon(
                      onPressed: _loading ? null : _lookup,
                      icon: const Icon(Icons.search_rounded, size: 18),
                      label: const Text('Find My Fine'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
        if (_loading) const LoadingOverlay(message: 'Looking up fine...'),
      ],
    );
  }

  Widget _quickFillCard(
      String ref, String cat, String label, String amount) {
    return InkWell(
      onTap: () {
        _refCtrl.text = ref;
        _catCtrl.text = cat;
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppTheme.border, width: 0.8),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.receipt_outlined,
                  color: AppTheme.primary, size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label,
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primary)),
                  Text('$ref · $cat',
                      style: const TextStyle(
                          fontSize: 11, color: AppTheme.textMuted)),
                ],
              ),
            ),
            Text(amount,
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.primary)),
            const SizedBox(width: 4),
            const Icon(Icons.chevron_right_rounded,
                color: AppTheme.textMuted, size: 16),
          ],
        ),
      ),
    );
  }
}