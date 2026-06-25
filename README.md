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
npm run tunnel (if expo start has any issue with localhost)
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
- Then create an API Key and allow these 2 APIs into that key

⚠️ If not enabled → map will be blank even with correct keys.

**Or use a demo key for testing:**
<https://mapsplatform.google.com/maps-demo-key/>

---

# ☁️ 3. Firebase Setup

Go to Firebase Console:
<https://console.firebase.google.com/>

### Step 1 — Create a New Project

1. Click **Create a project**
2. Enter project name: `bag-discovery`
3. Accept terms and click **Continue**
4. Disable Google Analytics (optional) and click **Create project**

---

### Step 2 — Add Web App

1. Click the **Web icon** (</>) in the project overview
2. Enter app nickname: `bag-discovery-web`
3. Click **Register app**
4. Copy the Firebase config object

---

### Step 3 — Add Credentials to `.env.local`

Paste the copied credentials into your `.env.local` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_apiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_authDomain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_projectId
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storageBucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId
EXPO_PUBLIC_FIREBASE_APP_ID=your_appId
```

---

### Step 4 — Login & Deploy

```bash
firebase login
```

```bash
firebase use bag-discovery
```

```bash
firebase deploy
```

---

✔ Firestore and deployment will be handled automatically

---

# 🌱 4. Seed Database

```bash
npx ts-node src/scripts/seed.ts
```

---

# 🧱 5. Project Structure

app/ → Screens  
src/components/ → UI  
src/functions/ → Firebase logic  
src/hooks/ → Hooks  
src/utils/ → Helpers  
src/types/ → Types  
assets/ → Images  

---

# 🧠 6. Architecture Decisions

- Firebase Firestore for real-time sync  
- Map clustering for performance  
- Latitude/longitude stored directly  
- Expo Router for navigation  
- Marker optimization with tracksViewChanges  

---

# 🚨 7. Known Issues

- No geo-radius backend filtering  
- iOS needs proper dev build setup  
- Clustering varies at extreme zoom  
- No authentication  

---

# ⏱️ 8. Time Spent

~X hours total

---

# 👨‍💻 9. Author

Built with Expo + React Native + Firebase
