# Pak Shutter App — Setup & Publishing Guide

React Native (Expo SDK 58) Android app for Pak Shutter, with a Firebase-powered admin panel.

## What's in the app

| Customer side | Admin side (login required) |
|---|---|
| Home: hero, quick Call / WhatsApp / Quote / Location buttons, services, stats, shutter types, gallery, testimonials | Quote requests inbox: new / contacted / completed / cancelled, call or WhatsApp the customer, private notes, delete |
| Services list + detail pages (installation, repair, maintenance, custom metal works) | Edit business details: phone, WhatsApp, email, address, hours, home & about text and photos, stats |
| Shutter types + detail pages (features, best for) | Add / edit / delete services, shutter types, gallery photos, testimonials |
| Photo gallery with full-screen viewer | Upload photos from the phone gallery (auto-resized) |
| Quote form: name, phone, address, email, service, shutter type, size, message | "Load website content" button copies the built-in content into the database |
| Contact Us page, About, Privacy Policy, floating WhatsApp button | |

Without Firebase connected the app still works fully for customers (built-in website content, quote requests go to WhatsApp). Firebase adds the admin panel and the saved quote inbox.

## 1. Create the Firebase project (free, ~10 minutes)

1. Go to https://console.firebase.google.com with the business Google account → **Add project** → name it `Pak Shutter` → Google Analytics can be off.
2. **Build → Firestore Database → Create database** → choose location `asia-south1 (Mumbai)` → start in **production mode**.
3. Open the **Rules** tab, replace everything with the contents of `firebase/firestore.rules`, and click **Publish**.
4. **Build → Authentication → Get started → Email/Password → Enable**.
5. **Authentication → Users → Add user**: enter the admin email and a strong password. Copy the **User UID** shown in the list.
6. **Firestore → Data → Start collection**: collection ID `admins`, document ID = the **User UID** from step 5, add one field `role` (string) = `owner`. Save.
   (To add another admin later, create the user and add another document with their UID.)
7. **Project settings (gear icon) → Your apps → Web (</>)** → register app `Pak Shutter App` → copy the `firebaseConfig` values.
8. Paste them into `src/config/firebaseConfig.js` (or send them to your developer) and rebuild the app.

Then open the app → Contact tab → **Admin** (or long-press the logo on the Home screen) → log in → tap **Load website content** once.

> Photos uploaded in the admin panel are stored in Firestore, so the free **Spark plan** is enough — no credit card needed.

## 2. Build the APK / Play Store bundle

Builds run on GitHub Actions (free), see `.github/workflows/android-build.yml`.

1. Push this project to a **private** GitHub repository.
2. Repository → Settings → Secrets and variables → Actions → add:
   - `PS_KEYSTORE_BASE64` — the upload keystore, base64 encoded (`base64 -w0 pakshutter-upload.keystore`)
   - `PS_KEYSTORE_PASSWORD`, `PS_KEY_PASSWORD` — from `KEYSTORE-INFO.txt`
   - `PS_KEY_ALIAS` — `pakshutter`
3. Actions tab → **Build Android** → Run workflow. After ~15 minutes download the artifact:
   - `PakShutter.apk` — install directly on any Android phone
   - `PakShutter-PlayStore.aab` — upload this to Google Play

Local alternative (needs Android Studio + JDK 17): `npm ci && npx expo prebuild -p android && cd android && ./gradlew bundleRelease`.

For every update, increase `version` and `android.versionCode` in `app.json` before building.

## 3. Publish on Google Play

1. Create a developer account at https://play.google.com/console (one-time US$25 fee, identity verification required).
2. **Create app** → name `Pak Shutter`, app, free.
3. Upload `PakShutter-PlayStore.aab` to **Testing → Internal testing** first, then **Production**. Keep Play App Signing ON.
   Note: new personal developer accounts must run a closed test with at least 12 testers for 14 days before production. Organization accounts are exempt.
4. Store listing:
   - App icon: `assets/play-icon-512.png`
   - Feature graphic 1024×500 and 2–8 phone screenshots (take them from the app)
   - Short description: *Rolling shutters, repair & metal works in Karachi — get a free quote.*
5. App content:
   - **Privacy policy URL** — required because the app collects name/phone/address. Publish the text from the app's Privacy Policy screen on pakshutter.com (e.g. `pakshutter.com/privacy`).
   - **Data safety**: collects *Name, Phone number, Address, Email (optional)*; purpose *App functionality / Customer support*; encrypted in transit: Yes; not shared with third parties; users can request deletion: Yes.
   - Ads: No. Target audience: 18+. Content rating questionnaire: business/utility, no sensitive content.
   - Admin login: provide a demo admin account under **App access**, or state that login is staff-only and the customer side needs no login.

## Project structure

```
App.js                     navigation (tabs + screens)
src/data/defaults.js       content from pakshutter.com (fallback + seed)
src/screens/               customer screens
src/admin/                 admin panel (schemas.js drives the editors)
src/config/firebaseConfig  Firebase keys
firebase/firestore.rules   database security rules
plugins/withReleaseSigning Play Store signing config
```

## Contact details used

Phone +92 341-1696263 · WhatsApp 923411696263 · pakshutter626@gmail.com · Block 2 North Karachi, Karachi 75400
