import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/fine_model.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/common_widgets.dart';
import 'success_screen.dart';


class PaymentScreen extends StatefulWidget {
  final FineModel fine;
  const PaymentScreen({super.key, required this.fine});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _holderCtrl = TextEditingController();
  final _cardCtrl = TextEditingController();
  final _expiryCtrl = TextEditingController();
  final _cvvCtrl = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _pay() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      // NOTE: payments are made against the fine's numeric DB id
      // (POST /api/driver/fines/{id}/pay), not the reference number.
      final result = await ApiService.processPayment(
        widget.fine.id,
        PaymentModel(
          fineReference: widget.fine.referenceNumber,
          cardHolder: _holderCtrl.text.trim(),
          cardNumber: _cardCtrl.text.replaceAll(' ', ''),
          expiry: _expiryCtrl.text.trim(),
          cvv: _cvvCtrl.text.trim(),
        ),
      );
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => SuccessScreen(
            fine: widget.fine,
            transactionId: result['transactionId'],
          ),
        ),
      );
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _holderCtrl.dispose();
    _cardCtrl.dispose();
    _expiryCtrl.dispose();
    _cvvCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Order summary ──
                  SurfaceCard(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Fine Reference',
                                style: TextStyle(
                                    fontSize: 11, color: AppTheme.textMuted)),
                            Text(widget.fine.referenceNumber,
                                style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.primary)),
                            const SizedBox(height: 2),
                            Text(widget.fine.category,
                                style: const TextStyle(
                                    fontSize: 12, color: AppTheme.textMuted)),
                          ],
                        ),
                        Column(crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text('Total',
                                style: TextStyle(
                                    fontSize: 11, color: AppTheme.textMuted)),
                            Text(
                              widget.fine.formattedAmount,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.primary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Error
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
                                    fontSize: 13, color: AppTheme.danger))),
                      ]),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // ── Card form ──
                  const SectionHeader(title: 'CARD DETAILS'),

                  // Visual card mockup
                  _CardPreview(
                    holder: _holderCtrl.text,
                    number: _cardCtrl.text,
                    expiry: _expiryCtrl.text,
                  ),
                  const SizedBox(height: 20),

                  // Card holder name
                  TextFormField(
                    controller: _holderCtrl,
                    textCapitalization: TextCapitalization.words,
                    onChanged: (_) => setState(() {}),
                    decoration: const InputDecoration(
                      labelText: 'Card Holder Name',
                      prefixIcon: Icon(Icons.person_outline,
                          color: AppTheme.textMuted, size: 20),
                    ),
                    validator: (v) =>
                        v!.isEmpty ? 'Enter card holder name' : null,
                  ),
                  const SizedBox(height: 14),

                  // Card number
                  TextFormField(
                    controller: _cardCtrl,
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      _CardNumberFormatter(),
                    ],
                    maxLength: 19,
                    decoration: const InputDecoration(
                      labelText: 'Card Number',
                      hintText: '0000 0000 0000 0000',
                      prefixIcon: Icon(Icons.credit_card_rounded,
                          color: AppTheme.textMuted, size: 20),
                      counterText: '',
                    ),
                    validator: (v) {
                      final digits = v!.replaceAll(' ', '');
                      if (digits.length < 16) return 'Enter 16-digit card number';
                      return null;
                    },
                  ),
                  const SizedBox(height: 14),

                  // Expiry + CVV
                  Row(children: [
                    Expanded(
                      child: TextFormField(
                        controller: _expiryCtrl,
                        keyboardType: TextInputType.number,
                        onChanged: (_) => setState(() {}),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          _ExpiryFormatter(),
                        ],
                        maxLength: 5,
                        decoration: const InputDecoration(
                          labelText: 'Expiry (MM/YY)',
                          hintText: 'MM/YY',
                          prefixIcon: Icon(Icons.calendar_today_outlined,
                              color: AppTheme.textMuted, size: 18),
                          counterText: '',
                        ),
                        validator: (v) =>
                            v!.length < 5 ? 'Enter valid expiry' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _cvvCtrl,
                        keyboardType: TextInputType.number,
                        obscureText: true,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        maxLength: 3,
                        decoration: const InputDecoration(
                          labelText: 'CVV',
                          hintText: '•••',
                          prefixIcon: Icon(Icons.lock_outline,
                              color: AppTheme.textMuted, size: 18),
                          counterText: '',
                        ),
                        validator: (v) =>
                            v!.length < 3 ? 'Enter 3-digit CVV' : null,
                      ),
                    ),
                  ]),

                  const SizedBox(height: 12),
                  // Security note
                  Row(
                    children: const [
                      Icon(Icons.lock_rounded, size: 13, color: AppTheme.textMuted),
                      SizedBox(width: 5),
                      Text('256-bit SSL encrypted. Your data is safe.',
                          style: TextStyle(
                              fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Pay button
                  ElevatedButton.icon(
                    onPressed: _loading ? null : _pay,
                    icon: const Icon(Icons.lock_rounded, size: 18),
                    label: Text(
                      'Pay ${widget.fine.formattedAmount} Securely',
                    ),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.success),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(50),
                      side: const BorderSide(color: AppTheme.border),
                    ),
                    child: const Text('Cancel',
                        style: TextStyle(color: AppTheme.textMuted)),
                  ),
                ],
              ),
            ),
          ),
          if (_loading)
            const LoadingOverlay(message: 'Processing payment...'),
        ],
      ),
    );
  }
}

// ── Card visual preview ──────────────────────────────────────
class _CardPreview extends StatelessWidget {
  final String holder;
  final String number;
  final String expiry;

  const _CardPreview(
      {required this.holder, required this.number, required this.expiry});

  @override
  Widget build(BuildContext context) {
    final masked = number.isEmpty
        ? '•••• •••• •••• ••••'
        : number.padRight(19, '•').substring(0, 19);

    return Container(
      height: 160,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppTheme.primary, AppTheme.primaryLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Icon(Icons.shield_rounded,
                color: AppTheme.accent, size: 22),
            const Text('VISA',
                style: TextStyle(
                    color: Colors.white,
                    fontStyle: FontStyle.italic,
                    fontSize: 18,
                    fontWeight: FontWeight.w700)),
          ]),
          const Spacer(),
          Text(masked,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  letterSpacing: 2,
                  fontWeight: FontWeight.w500)),
          const SizedBox(height: 10),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('CARD HOLDER',
                  style: TextStyle(
                      color: Colors.white.withOpacity(0.6), fontSize: 9)),
              Text(
                holder.isEmpty ? '—' : holder.toUpperCase(),
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ]),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text('EXPIRES',
                  style: TextStyle(
                      color: Colors.white.withOpacity(0.6), fontSize: 9)),
              Text(
                expiry.isEmpty ? 'MM/YY' : expiry,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ]),
          ]),
        ],
      ),
    );
  }
}

// ── Input formatters ─────────────────────────────────────────
class _CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue old, TextEditingValue value) {
    final digits = value.text.replaceAll(' ', '');
    final buffer = StringBuffer();
    for (var i = 0; i < digits.length && i < 16; i++) {
      if (i > 0 && i % 4 == 0) buffer.write(' ');
      buffer.write(digits[i]);
    }
    final text = buffer.toString();
    return value.copyWith(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}

class _ExpiryFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue old, TextEditingValue value) {
    final digits = value.text.replaceAll('/', '');
    final buffer = StringBuffer();
    for (var i = 0; i < digits.length && i < 4; i++) {
      if (i == 2) buffer.write('/');
      buffer.write(digits[i]);
    }
    final text = buffer.toString();
    return value.copyWith(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}