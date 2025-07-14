# TRIP.LO - Aplikacja Planera Podróży 🌍✈️

[![Status Builda](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Licencja](https://img.shields.io/badge/license-MIT-blue)](https://github.com)

**TRIP.LO** to nowoczesna aplikacja mobilna do planowania i zarządzania podróżami, która integruje wszystkie niezbędne funkcje w jednym miejscu. Projekt ma na celu uproszczenie organizacji wyjazdów zarówno prywatnych, jak i służbowych.

## Spis treści

- [O projekcie](#o-projekcie)
- [Kluczowe funkcje](#kluczowe-funkcje)
- [Stos technologiczny](#stos-technologiczny)
- [Architektura](#architektura)
- [Wymagania niefunkcjonalne](#wymagania-niefunkcjonalne)
- [Pierwsze kroki](#pierwsze-kroki)
- [Licencja](#licencja)

---

## O projekcie

Współczesne planowanie podróży wymaga zarządzania wieloma rozproszonymi informacjami, takimi jak rezerwacje, bilety, atrakcje turystyczne i budżet. **TRIP.LO** rozwiązuje ten problem, oferując zintegrowaną platformę, która pozwala użytkownikom zarządzać całą podróżą z poziomu aplikacji mobilnej (Android i iOS) lub przeglądarki internetowej.

Aplikacja jest skierowana zarówno do indywidualnych podróżników, jak i do grup (rodzin, przyjaciół, firm), umożliwiając im wspólne planowanie wyjazdów, dzielenie się planami i zarządzanie wydatkami.

---

## Kluczowe funkcje

Aplikacja oferuje szeroki zakres funkcji ułatwiających organizację każdej podróży:

* **👥 Zarządzanie użytkownikami**: Rejestracja i logowanie przez e-mail lub konta społecznościowe (Google, Facebook) z wykorzystaniem bezpiecznych tokenów JWT.
* **🗺️ Tworzenie planu podróży**: Możliwość definiowania szczegółów wyjazdu, takich jak cel, daty, transport, a także przypisywanie zadań poszczególnym uczestnikom.
* **📄 Zarządzanie rezerwacjami i dokumentami**: Przechowywanie biletów, rezerwacji hotelowych i zdjęć dokumentów z opcjonalną integracją z OneDrive API.
* **💰 Zarządzanie budżetem**: Ustawianie budżetu, śledzenie wydatków w różnych kategoriach i automatyczne generowanie raportów w postaci wykresów. Umożliwia także podział kosztów między podróżnych.
* **📍 Integracja z Google Maps**: Tworzenie tras podróży, monitorowanie warunków drogowych i śledzenie lokalizacji współtowarzyszy w czasie rzeczywistym.
* **🤝 Współdzielenie i współpraca**: Udostępnianie planów podróży innym osobom z możliwością wspólnej edycji.
* **☁️ Synchronizacja w chmurze**: Wszystkie dane są synchronizowane w chmurze, co zapewnia dostęp do nich na różnych urządzeniach (mobilnych i webowych).
* **🔔 Powiadomienia Push**: Aplikacja wysyła powiadomienia o nadchodzących terminach, zmianach w planie czy interesujących wydarzeniach w pobliżu.
* **🍽️ Wyszukiwanie atrakcji**: Możliwość wyszukiwania lokalnych atrakcji, restauracji i muzeów dzięki integracji z Google Places API.

---

## Stos technologiczny

System oparty jest na nowoczesnych i skalowalnych technologiach, zapewniając wydajność i bezpieczeństwo.

* **Frontend**:
    * `React Native`: Do tworzenia natywnych aplikacji mobilnych na platformy Android i iOS z jednej bazy kodu.
* **Backend**:
    * `TypeScript (Node.js)`: Zapewnia wysoką wydajność, bezpieczeństwo i skalowalność dzięki silnemu typowaniu i asynchronicznej obsłudze zapytań.
* **Baza danych**:
    * `PostgreSQL`: Wydajna i niezawodna relacyjna baza danych do przechowywania danych użytkowników, planów podróży i rezerwacji.
* **Pamięć podręczna (Cache)**:
    * `Redis`: Szybki magazyn danych w pamięci do przechowywania m.in. sesji użytkowników w celu poprawy wydajności aplikacji.
* **Integracje zewnętrzne**:
    * `Google Maps API`: Mapy, wyznaczanie tras i dane o lokalizacjach.
    * `Booking API` (i inne): Bezpośrednia rezerwacja hoteli, lotów i pociągów.
    * `OneDrive API`: Przechowywanie dokumentów i plików użytkowników w chmurze.
    * `Stripe` (przykład): Obsługa płatności.
* **Bezpieczeństwo**:
    * `JWT (JSON Web Tokens)`: Do bezpiecznej autentykacji użytkowników.
    * `SSL/TLS` i `AES-256`: Szyfrowanie danych w tranzycie i w bazie danych.
* **Monitorowanie**:
    * `New Relic` (przykład): Monitorowanie wydajności aplikacji.
    * `Sentry` (przykład): Logowanie i analiza błędów.

---

## Architektura

Aplikacja została zaprojektowana w architekturze **klient-serwer**, co zapewnia wyraźne oddzielenie warstwy interfejsu użytkownika (frontend) od logiki biznesowej i bazy danych (backend). Cały system jest oparty na **chmurze**, co gwarantuje skalowalność, bezpieczeństwo i elastyczność.

---

## Wymagania niefunkcjonalne

* **Wydajność**: Czas odpowiedzi na zapytania użytkownika nie powinien przekraczać 2 sekund, a czas ładowania aplikacji 5 sekund. System jest projektowany do obsługi co najmniej 5,000 aktywnych użytkowników dziennie.
* **Dostępność**: Gwarantowana dostępność na poziomie **99.9%** (maksymalnie 43 minuty przestoju miesięcznie). Aplikacja będzie również oferować ograniczony tryb offline.
* **Bezpieczeństwo**: Pełna zgodność z RODO, szyfrowanie danych i bezpieczne uwierzytelnianie to kluczowe priorytety projektu.
* **UI/UX**: Interfejs będzie prosty, intuicyjny i responsywny, dostosowany do telefonów, tabletów i komputerów, z uwzględnieniem zasad dostępności (WCAG).

---

## Pierwsze kroki

<!--
Tutaj umieść instrukcje dotyczące instalacji zależności, konfiguracji środowiska i uruchomienia projektu lokalnie.

### Wymagania wstępne

- Node.js (wersja X.X)
- npm / yarn
- Docker (opcjonalnie)

### Instalacja

1. Sklonuj repozytorium
   ```sh
   git clone [https://github.com/twoja-nazwa-uzytkownika/trip-lo.git](https://github.com/twoja-nazwa-uzytkownika/trip-lo.git)
   ```
2. Zainstaluj zależności
   ```sh
   npm install
   ```
3. Uruchom aplikację
   ```sh
   npm start
   ```
-->

---

## Licencja

Projekt jest dystrybuowany na licencji MIT. Zobacz `LICENSE.txt`, aby uzyskać więcej informacji.
