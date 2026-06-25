# 🛍️ Bag Discovery App

A React Native (Expo) application that allows users to discover and reserve surplus food bags from restaurants, bakeries, and grocery stores using an interactive map with clustering and Firebase backend.

---

# 🚀 1. Setup Instructions

## 📥 Clone Repository

```bash
git clone https://github.com/MrFahad4444/bag-discovery
cd bag-discovery
```

---

## 📦 Install Dependencies

```bash
npm install
or
yarn
```

---

## ▶️ Start Development Server

```bash
npx expo start
or
npm run tunnel (if expo start have any issue with local host)
```

---

You can run the app using:

- 📱 Expo Go (limited support for maps)
- 🤖 Android Emulator
- 🍎 iOS Simulator
- ⚡ Development Build (recommended)

Docs:
<https://docs.expo.dev>

---

# 🔐 2. Environment Setup

This project uses `.env.local` for all secrets.

---

## Step 1 — Rename file

```bash
.env.example → .env.local
```

---

## Step 2 — Fill values

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

GOOGLE_MAPS_ANDROID_API_KEY=your_android_key
GOOGLE_MAPS_IOS_API_KEY=your_ios_key
```

---

## 🗺️ Google Maps Setup (REQUIRED)

Enable APIs:
<https://console.cloud.google.com/apis/library>

- Maps SDK for Android
- Maps SDK for iOS
and then create ApiKey and allow these 2 apis into that key

⚠️ If not enabled → map will be blank even with correct keys.
or
You can use a demo key for testing from here:
<https://mapsplatform.google.com/maps-demo-key/>
---

# ⚙️ 3. Expo Config Setup

This project uses `app.config.js` (NOT app.json)

```js
import 'dotenv/config';

export default {
  expo: {
    name: "bag-discovery",
    slug: "bag-discovery",

    ios: {
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
      },
    },

    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
        },
      },
    },
  },
};
```

---

# ☁️ 4. Firebase Setup

## Login

```bash
firebase login
```

## Select project

```bash
firebase use <YOUR_PROJECT_ID>
```

## Deploy rules + indexes

```bash
firebase deploy
```

---

✔ No manual Firestore setup required

---

# 🌱 5. Seed Database

```bash
npx ts-node src/scripts/seed.ts
```

---

# 🧱 6. Project Structure

app/ → Screens  
src/components/ → UI  
src/functions/ → Firebase logic  
src/hooks/ → Hooks  
src/utils/ → Helpers  
src/types/ → Types  
assets/ → Images  

---

# 🧠 7. Architecture Decisions

- Firebase Firestore for real-time sync  
- Map clustering for performance  
- Latitude/longitude stored directly  
- Expo Router for navigation  
- Marker optimization with tracksViewChanges  

---

# 🚨 8. Known Issues

- No geo-radius backend filtering  
- iOS needs proper dev build setup  
- Clustering varies at extreme zoom  
- No authentication  

---

# ⏱️ 9. Time Spent

~X hours total

---

# 👨‍💻 Author

Built with Expo + React Native + Firebase
