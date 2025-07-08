{
  "title": "Build Instruction: Festival Foto-App (iOS MVP)",
  "goal": "Erstelle eine native iOS-App für Festivalgruppen mit Fokus auf gemeinsames Foto-Sharing – inkl. Offline-Nutzung, DSGVO-Konformität und optionalen Premium-Features.",
  "mvp_features": {
    "must_haves": [
      "Gruppenverwaltung (Erstellung durch Admin, Einladungen via Link/QR-Code)",
      "Gruppengalerie mit: Echtzeit-Foto-Upload, Gemeinsames Gruppenalbum, Sichtbarkeits-Optionen (privat, Gruppe, gesamtes Festival)",
      "Gastzugang via Name (eingeschränkter Zugriff)",
      "Offline-Fotoupload mit späterem Sync",
      "Packliste (privat / gruppenbasiert)",
      "Standortbasierte Freundesfindung",
      "DSGVO-konformes Opt-in für Uploads und Tracking"
    ],
    "nice_to_have": [
      "BeReal-ähnlicher Tagesfoto-Prompt",
      "Festivalübergreifende öffentliche Galerie",
      "Push-Nachrichten",
      "API-Integration zu Ticketplattformen"
    ]
  },
  "tech_stack": {
    "frontend": {
      "framework": "Expo + React Native",
      "platforms": [
        "iOS (MVP)",
        "Android (später)",
        "Web (optional)"
      ],
      "navigation": "React Navigation",
      "offline_support": "expo-file-system + AsyncStorage + background-sync"
    },
    "backend": {
      "platform": "Supabase (PostgreSQL + Storage + Auth)",
      "auth": {
        "provider": "Clerk or Supabase Auth",
        "guest_access": true,
        "scopes": [
          "private_photo_viewing"
        ]
      },
      "storage": "Supabase Storage (DSGVO-konform, EU-Region)",
      "realtime": "Supabase Realtime",
      "image_upload": "UploadThing or native upload"
    },
    "extras": {
      "location": "Expo Location API",
      "push": "Expo Push Notifications",
      "analytics": "Plausible (self-hosted, optional)",
      "monitoring": "Sentry (Privacy compliant setup)"
    }
  },
  "privacy": {
    "regions": "EU-Regionen für Supabase/S3-Storage",
    "trackers": "Keine 3rd-Party-Tracker im MVP",
    "personal_data": "Keine persönlichen Daten ohne explizites Opt-in",
    "upload_consent": "Jeder Upload = Zustimmung zur Veröffentlichung im jeweiligen Sichtbarkeitsgrad"
  },
  "build_commands": [
    "npx create-expo-app festival-fotos",
    "cd festival-fotos",
    "npx expo install @supabase/supabase-js react-navigation ...",
    "# Lokaler iOS Build mit EAS",
    "eas build --platform ios --profile local-ios --local --output build/"
  ],
  "deployment_ios": [
    "Apple Developer Account",
    "Expo EAS Build (für native iOS Binary)",
    "Testflight-Verteilung mit QR-Code fürs Camp",
    "Öffne das Projekt in Xcode: xed ios",
    "Signiere mit deinem Apple Team in Xcode (Signing & Capabilities)",
    "Exportiere .xcarchive → .ipa für TestFlight oder manuelle Installation"
  ],
  "roadmap": [
    {
      "phase": "0. Setup",
      "goals": "Projektstruktur, Supabase-Instanz, DSGVO-Check"
    },
    {
      "phase": "1. Core",
      "goals": "Gruppen-Login, Foto-Upload, Galerie-View, Auth"
    },
    {
      "phase": "2. UX",
      "goals": "Offline Sync, QR-Einladung, Sichtbarkeiten"
    },
    {
      "phase": "3. Extra",
      "goals": "Packlisten, Standort-Freunde, Tagesfoto"
    },
    {
      "phase": "4. Monet.",
      "goals": "Werbefläche, Premium-Toggles, Partner-API"
    },
    {
      "phase": "5. Deploy",
      "goals": "EAS Build, App Store Review, Festival-Promo"
    }
  ]
}