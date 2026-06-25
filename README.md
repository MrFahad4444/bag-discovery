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

Documentation: <https://docs.expo.dev>

---

# 🔐 2. Environment Setup

This project uses `.env.local` for all environment secrets.

---

## Step 1 — Rename File

```bash
.env.example → .env.local
```

---

## Step 2 — Fill Values

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_apiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_authDomain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_projectId
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storageBucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId
EXPO_PUBLIC_FIREBASE_APP_ID=your_appId

GOOGLE_MAPS_ANDROID_API_KEY=your_android_key
GOOGLE_MAPS_IOS_API_KEY=your_ios_key
```

---

## 🗺️ Google Maps Setup (REQUIRED)

Enable the required APIs in Google Cloud Console:
<https://console.cloud.google.com/apis/library>

- Maps SDK for Android
- Maps SDK for iOS
- Create an API Key and enable these 2 APIs for that key

⚠️ If not enabled → the map will remain blank even with correct API keys.

**Alternatively, use a demo key for testing:**
<https://mapsplatform.google.com/maps-demo-key/>

---

# ☁️ 3. Firebase Setup

Navigate to Firebase Console:
<https://console.firebase.google.com/>

### Step 1 — Create a New Project

1. Click **Create a project**
2. Enter project name: `bag-discovery`
3. Accept the terms and click **Continue**
4. Disable Google Analytics (optional) and click **Create project**

---

### Step 2 — Add Web App

1. Click the **Web icon** (</>) in the project overview
2. Enter app nickname: `bag-discovery-web`
3. Click **Register app**
4. Copy the Firebase configuration object

---

### Step 3 — Add Credentials to `.env.local`

Paste the copied Firebase credentials into your `.env.local` file:

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

✔ Firestore will automatically set all rules and indexes during deployment.

---

### Step 5 — Seed Database (REQUIRED)

⚠️ **IMPORTANT**: You MUST update the coordinates before seeding, or bags will appear at a different location.

Open `src/scripts/seed.ts` and update the following coordinates to your location:

```typescript
const MY_LAT = 24.7136;  // ⚠️ REQUIRED: Replace with your latitude
const MY_LNG = 46.6753;  // ⚠️ REQUIRED: Replace with your longitude
```

**Example coordinates shown are for Riyadh, Saudi Arabia. Without updating these, bags will appear at this default location instead of near you.**

Once you've updated your coordinates, run:

```bash
npx ts-node src/scripts/seed.ts
```

✔ This will populate Firestore with bag data near your specified location.

---

# 🧱 4. Project Structure

```
app/                  → Screens
src/components/       → UI Components
src/functions/        → Firebase Logic
src/services/         → Firebase Setup and Generic CRUD Operations
src/hooks/            → Custom React Hooks
src/utils/            → Helper Functions
src/types/            → TypeScript Type Definitions
assets/               → Images and Static Assets
```

---

# 🧠 5. Architecture Decisions

- **Language Provider**: Wraps the entire app. When the language preference is switched, the entire application re-renders without requiring a full reload.
- **Firestore Indexes**: Implemented for efficient compound queries.
- **Generic CRUD Functions**: Created reusable CRUD operations for Firestore that can be used modularly across the application.
- **Custom Action Functions**: Built specific functions for each action, mimicking API-style endpoints using the generic CRUD layer.
- **Custom Hooks**: Encapsulate entire Firebase operations to simplify usage and reduce complexity.
- **Modularity & Documentation**: Code is organized modularly with comprehensive documentation for maintainability.
- **Separation of Concerns**: UI is completely separate from business logic to keep the codebase consistent and easy to update in the future.

---

# 💡 6. Future Improvements

- Refine and improve the UI/UX design
- Fix Google Maps clustering behavior—markers sometimes disappear at certain zoom levels
- Implement a carousel view for bags displayed on the map, with synchronized marker highlighting during swipes
- Add distance calculation and filter results based on proximity
- Implement time-based status validation to confirm availability only within specified time windows
- Optimize API calls to prevent duplicate requests (Home page and Maps currently request the same products twice)

---

# 🚨 7. Known Issues

- No geo-radius backend filtering implemented
- iOS requires proper development build configuration
- Clustering behavior is inconsistent at extreme zoom levels; markers may not render properly
- Anonymous authentication used (no user authentication system)
- Home page and Maps screen load the same products, resulting in duplicate API requests—should be called once and reflected across screens
- Custom map markers and carousel view not yet implemented
- Expo Notification warning: As of SDK 53, notifications require a development build rather than Expo Go, but the app currently functions with Expo Go

---

# 📊 8. Firestore Indexes

The following composite index is required for efficient querying:

```json
{
  "collectionGroup": "reservations",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "userId",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "DESCENDING"
    }
  ]
}
```

This index optimizes queries filtering reservations by user ID and ordering by creation date.

---

# ⏱️ 9. Time Spent

Approximately 2.5 days of development

---

# 👨‍💻 10. Author

Built with Expo, React Native, and Firebase by Muhammad Fahad
