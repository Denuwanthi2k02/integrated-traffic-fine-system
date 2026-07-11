class FineModel {
  final int id;
  final String referenceNumber;
  final String category;          
  final String district;
  final int amount;               
  final String date;             
  final String status;           
  final String officer;          
  final String licensePlate;
  final String licenseNumber;
  final String driverName;
  final String violationDetails;
  final String paymentDeadline;

  FineModel({
    required this.id,
    required this.referenceNumber,
    required this.category,
    required this.district,
    required this.amount,
    required this.date,
    required this.status,
    required this.officer,
    required this.licensePlate,
    required this.licenseNumber,
    required this.driverName,
    required this.violationDetails,
    required this.paymentDeadline,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) => FineModel(
        id: json['id'] is int
            ? json['id']
            : int.tryParse('${json['id'] ?? 0}') ?? 0,
        referenceNumber: json['referenceNumber'] ?? '',
        category: json['category'] ?? '',
        district: json['district'] ?? '',
        amount: json['amount'] is int
            ? json['amount']
            : ((json['amount'] as num?)?.toInt() ?? 0),
        date: json['date'] ?? '',
        status: (json['status'] ?? 'PENDING').toString(),
        officer: json['officer'] ?? '',
        licensePlate: json['licensePlate'] ?? '',
        licenseNumber: json['licenseNumber'] ?? '',
        driverName: json['driverName'] ?? '',
        violationDetails: json['violationDetails'] ?? '',
        paymentDeadline: json['paymentDeadline'] ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'referenceNumber': referenceNumber,
        'category': category,
        'district': district,
        'amount': amount,
        'date': date,
        'status': status,
        'officer': officer,
        'licensePlate': licensePlate,
        'licenseNumber': licenseNumber,
        'driverName': driverName,
        'violationDetails': violationDetails,
        'paymentDeadline': paymentDeadline,
      };

  String get formattedAmount =>
      'Rs. ${amount.toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (m) => ',')}';
}

class PaymentModel {
  final String fineReference;
  final String cardHolder;
  final String cardNumber;
  final String expiry;
  final String cvv;

  PaymentModel({
    required this.fineReference,
    required this.cardHolder,
    required this.cardNumber,
    required this.expiry,
    required this.cvv,
  });
}