# Traffic Fine Payment App — Member 3 (Flutter)

Android app for on-the-spot traffic fine payment.

## Setup & Run

```bash
flutter pub get
flutter run
```

**Demo login:** `driver` / `driver123`

## App Screens

| Screen | Description |
|---|---|
| Splash | Auto-login if JWT exists |
| Login | Enter credentials → JWT stored |
| Home | Bottom nav: Pay Fine + History |
| Fine Lookup | Enter Ref # + Category ID |
| Fine Detail | View fine info + officer details |
| Payment | Credit card form with live preview |
| Success | Receipt + SMS confirmation |
| History | Past payments summary |

## Demo Fine Slips (use on lookup screen)

| Ref # | Category ID | Violation | Amount |
|---|---|---|---|
| TF-2026-4821 | CAT-001 | Speeding | Rs. 3,000 |
| TF-2026-4820 | CAT-002 | No License | Rs. 5,000 |
| TF-2026-4818 | CAT-003 | Drunk Driving | Rs. 25,000 |
| TF-2026-4819 | CAT-004 | Illegal Parking | Rs. 1,500 |

## Connecting to Backend (Member 1 & 2)

All API calls are in `lib/services/api_service.dart`. Each mock has the real call commented above it:

```dart
// Uncomment when backend is ready:
// final res = await http.get(Uri.parse('$baseUrl/fines/lookup?ref=$ref&cat=$cat'));
// return FineModel.fromJson(jsonDecode(res.body));
```

Change `baseUrl` to your Spring Boot server IP. For Android emulator use `10.0.2.2:8080`.

## Project Structure

```
lib/
  main.dart              Entry point + splash router
  theme.dart             All colors, fonts, button styles
  models/
    fine_model.dart      FineModel + PaymentModel
  services/
    api_service.dart     All API calls + mock data
  widgets/
    common_widgets.dart  InfoRow, SurfaceCard, StatusBadge, etc.
  screens/
    login_screen.dart
    home_screen.dart
    fine_lookup_screen.dart
    fine_detail_screen.dart
    payment_screen.dart
    success_screen.dart
    history_screen.dart
```

