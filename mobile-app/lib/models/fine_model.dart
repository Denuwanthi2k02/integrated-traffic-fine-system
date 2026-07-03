class FineModel {
  final String referenceNumber;
  final String categoryId;
  final String categoryName;
  final double amount;
  final String officerName;
  final String officerBadge;
  final String district;
  final String violationDate;
  final String vehicleNumber;
  final String status;
  final String description;

  FineModel({
    required this.referenceNumber,
    required this.categoryId,
    required this.categoryName,
    required this.amount,
    required this.officerName,
    required this.officerBadge,
    required this.district,
    required this.violationDate,
    required this.vehicleNumber,
    required this.status,
    required this.description,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) => FineModel(
        referenceNumber: json['referenceNumber'] ?? '',
        categoryId: json['categoryId'] ?? '',
        categoryName: json['categoryName'] ?? '',
        amount: (json['amount'] ?? 0).toDouble(),
        officerName: json['officerName'] ?? '',
        officerBadge: json['officerBadge'] ?? '',
        district: json['district'] ?? '',
        violationDate: json['violationDate'] ?? '',
        vehicleNumber: json['vehicleNumber'] ?? '',
        status: json['status'] ?? 'pending',
        description: json['description'] ?? '',
      );

  Map<String, dynamic> toJson() => {
        'referenceNumber': referenceNumber,
        'categoryId': categoryId,
        'categoryName': categoryName,
        'amount': amount,
        'officerName': officerName,
        'officerBadge': officerBadge,
        'district': district,
        'violationDate': violationDate,
        'vehicleNumber': vehicleNumber,
        'status': status,
        'description': description,
      };
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