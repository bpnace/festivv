# Festival Foto-App

Eine native iOS-App für Festivalgruppen mit Fokus auf gemeinsames Foto-Sharing.

## 🎯 Ziel

Erstelle eine native iOS-App für Festivalgruppen mit Fokus auf gemeinsames Foto-Sharing – inkl. Offline-Nutzung, DSGVO-Konformität und optionalen Premium-Features.

## 📋 Aktueller Status

### ✅ **Phase 0: Setup - ABGESCHLOSSEN**
- **Projektstruktur**: Expo + React Native Projekt mit TypeScript
- **Paketmanager**: pnpm für kleinere Dateigrößen
- **Dependencies**: Alle erforderlichen Pakete installiert
- **Ordnerstruktur**: Organisierte Verzeichnisse (src/screens, src/types, src/constants, etc.)
- **Umgebungsvariablen**: .env.local mit Supabase-Credentials
- **Grundlegende Screens**: Welcome & Premium Screen implementiert
- **Design-System**: Farben, Spacing, deutsche Texte definiert

### ✅ **Phase 1.1: Datenbank-Setup - ABGESCHLOSSEN**
- **Supabase-Projekt**: Verbindung und Credentials eingerichtet
- **Datenbank-Schema**: 11 Tabellen mit allen Beziehungen erstellt
  - users, groups, group_members, photos, packing_lists, packing_items, etc.
- **Enum-Typen**: visibility_type, packing_category, subscription_tier, user_role
- **Storage-Buckets**: photos (10MB) und avatars (2MB) mit Berechtigungen
- **Row-Level Security**: Umfassende RLS-Policies für alle Tabellen
- **Premium Features**: 8 Premium-Features in der Datenbank vorkonfiguriert
- **Funktionen**: Utility-Funktionen wie get_nearby_users erstellt

### 🔧 **Nächste Schritte - Phase 1.2: Authentifizierung**
- **Authentifizierung**: Login/Registrierung + Gast-Zugang implementieren
- **Navigation**: Vollständige Navigation zwischen Screens
- **Gruppenverwaltung**: Gruppen erstellen, beitreten, verwalten
- **Foto-Upload**: Kamera-Integration und Foto-Sharing
- **Galerie**: Foto-Anzeige und Verwaltung

## ✨ MVP Features

### Must-Haves
- ✅ Grundlegende Projektstruktur
- ✅ Premium-Features Screen (Struktur)
- ✅ Datenbank-Schema mit allen benötigten Tabellen
- ⏳ Gruppenverwaltung (Erstellung durch Admin, Einladungen via Link/QR-Code)
- ⏳ Gruppengalerie mit:
  - Echtzeit-Foto-Upload
  - Gemeinsames Gruppenalbum
  - Sichtbarkeits-Optionen (privat, Gruppe, gesamtes Festival)
- ⏳ Gastzugang via Name (eingeschränkter Zugriff)
- ⏳ Offline-Fotoupload mit späterem Sync
- ⏳ Packliste (privat / gruppenbasiert)
- ⏳ Standortbasierte Freundesfindung
- ⏳ DSGVO-konformes Opt-in für Uploads und Tracking

### Nice-to-Have
- 📸 BeReal-ähnlicher Tagesfoto-Prompt
- 🌍 Festivalübergreifende öffentliche Galerie
- 📱 Push-Nachrichten
- 🎫 API-Integration zu Ticketplattformen

## 🛠 Tech Stack

### Frontend
- **Framework**: Expo + React Native
- **Plattformen**: iOS (MVP), Android (später), Web (optional)
- **Navigation**: React Navigation
- **Paketmanager**: pnpm
- **Offline Support**: expo-file-system + AsyncStorage + background-sync

### Backend
- **Platform**: Supabase (PostgreSQL + Storage + Auth)
- **Auth**: Supabase Auth (mit Guest Access)
- **Storage**: Supabase Storage (DSGVO-konform, EU-Region)
- **Realtime**: Supabase Realtime
- **Image Upload**: Native Supabase Upload

### Datenbank-Design
- **Tabellen**: 11 Tabellen (users, groups, photos, etc.)
- **Beziehungen**: Foreign Keys für alle Verbindungen
- **Sicherheit**: Row Level Security (RLS) für alle Tabellen
- **Storage**: 2 Storage-Buckets mit entsprechenden Berechtigungen
- **Funktionen**: Utility-Funktionen für Standortabfragen und mehr

## 🚀 Installation & Entwicklung

### Voraussetzungen
- Node.js 18+
- pnpm
- Expo CLI
- iOS Simulator / Android Emulator
- Supabase-Projekt mit konfigurierten Credentials

### Projekt starten
```bash
# In das Projekt-Verzeichnis wechseln
cd festivv

# Supabase-Credentials in .env.local eintragen
# SUPABASE_URL=https://your-project-url.supabase.co
# SUPABASE_ANON_KEY=your-anon-key

# Entwicklungsserver starten
pnpm start

# iOS Simulator
pnpm run ios

# Android Emulator  
pnpm run android

# Web
pnpm run web
```

## 📁 Projektstruktur

```
festivv/
├── src/
│   ├── constants/          # Farben, Spacing, deutsche Texte
│   ├── screens/           # App-Screens (Welcome, Premium, etc.)
│   ├── types/             # TypeScript-Definitionen
│   │   └── database.ts    # Datenbank-Typen
│   ├── navigation/        # Navigation-Konfiguration
│   ├── services/          # Supabase-Services
│   ├── components/        # Wiederverwendbare Komponenten
│   ├── hooks/             # Custom React Hooks
│   └── utils/             # Utility-Funktionen
├── .env.local             # Supabase Credentials
├── postgres-compliant-fix.sql  # Datenbank-Setup Skript
└── README.md             # Diese Datei
```

## 🗺 Roadmap

### ✅ Phase 0: Setup - ABGESCHLOSSEN
- ✅ Projektstruktur eingerichtet
- ✅ Dependencies installiert
- ✅ Grundlegende Screens erstellt
- ✅ Design-System definiert

### 🔄 Phase 1: Core - IN BEARBEITUNG
- ✅ **Phase 1.1: Datenbank-Setup**
  - ✅ Supabase-Projekt erstellt
  - ✅ Datenbank-Schema entworfen und implementiert
  - ✅ Storage-Buckets konfiguriert
  - ✅ Row-Level Security eingerichtet
  - ✅ Premium-Features vorkonfiguriert

- ⏳ **Phase 1.2: Authentifizierung**
  - ⏳ Login/Registrierung implementieren
  - ⏳ Gast-Zugang einrichten
  - ⏳ Benutzerprofile anlegen

- ⏳ **Phase 1.3: Gruppenfunktionen**
  - ⏳ Gruppen erstellen und verwalten
  - ⏳ Mitglieder einladen
  - ⏳ Berechtigungen festlegen

- ⏳ **Phase 1.4: Foto-Features**
  - ⏳ Kamera-Integration
  - ⏳ Foto-Upload
  - ⏳ Galerie-Ansicht

### ⏳ Phase 2: UX
- ⏳ Offline Sync
- ⏳ QR-Einladungen
- ⏳ Sichtbarkeits-Optionen
- ⏳ Benutzerfreundlichkeit

### ⏳ Phase 3: Extra Features
- ⏳ Packlisten
- ⏳ Standort-Freunde finden
- ⏳ Tagesfoto-Challenges
- ⏳ Push-Benachrichtigungen

### ⏳ Phase 4: Monetarisierung
- ⏳ Premium-Features aktivieren
- ⏳ Werbeflächen
- ⏳ Partner-API

### ⏳ Phase 5: Deployment
- ⏳ EAS Build
- ⏳ App Store Review
- ⏳ Festival-Marketing

## 🔒 Datenschutz

- **Regionen**: EU-Regionen für Supabase/Storage (DSGVO-konform)
- **Tracker**: Keine 3rd-Party-Tracker im MVP
- **Persönliche Daten**: Keine Daten ohne explizites Opt-in
- **Upload-Zustimmung**: Jeder Upload = Zustimmung zur Veröffentlichung

## 📱 iOS Deployment (Später)

1. **Apple Developer Account** erforderlich
2. **Expo EAS Build** für native iOS Binary
3. **Testflight-Verteilung** mit QR-Code fürs Camp

## 💡 Nächste Schritte

### Sofort:
1. **Authentifizierung implementieren** - Login/Registrierung + Gast-Modus
2. **Navigation vervollständigen** - Alle Screens verknüpfen
3. **Supabase Client einrichten** - Integration in Frontend

### Als Nächstes:
4. **Gruppenverwaltung** - Erstellen, beitreten, verwalten
5. **Foto-Features** - Kamera, Upload, Galerie
6. **Offline-Funktionalität** - Sync und lokale Speicherung

---

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.

---

**Status**: Phase 0 ✅ | Phase 1.1 (Datenbank) ✅ | Phase 1.2 (Auth) 🚀

Letzte Aktualisierung: Juli 2023
