# RideSafe MVP — English + Armenian

A simple, offline-first taxi/personal-safety MVP built with Expo + React Native + Supabase.

## Included

- English / Armenian UI
- Offline fake-call flow with bundled prerecorded prototype prompts
- Delayed fake-call notification
- Call Me (prefilled SMS)
- Live location sharing with a secure browser link
- I Feel Unsafe alert + live location
- Emergency screen with 112 and trusted-contact alert
- Safety Timer (local reminder in MVP)
- Loud Alarm
- Check-In
- Meet Me Outside
- Quick safety messages
- Discreet Mode
- Low-battery event while location sharing is active
- Last-known location in the browser viewer
- Connection-lost warning in the browser viewer
- Optional Safe Ride mode

## Important MVP limitations

1. **This is not an emergency-services integration.** The Emergency screen opens a normal phone call to Armenia's 112.
2. **iOS/Android do not let normal apps silently send SMS.** Call Me, Check-In, Meet Me Outside, Unsafe, and Emergency open the phone's SMS composer with a prepared message. The user still sends it.
3. **Delayed fake calls are implemented as local notifications.** Mobile operating systems do not allow a normal app to freely impersonate the system Phone app. Tapping the notification opens RideSafe's in-app incoming-call screen.
4. **The included voices are prototype synthesized recordings.** Replace the WAV files under `assets/audio/` with natural human recordings before user testing.
5. **Safety Timer remote escalation is not automatic in this starter.** It produces a local check-in reminder. Automatic SMS escalation requires a backend messaging provider and server scheduler.
6. Background location requires a **development/production build**, not Expo Go on iOS.

## Step 1 — prerequisites

Install Node.js 22.13+ (Expo SDK 57 requirement), Git, Xcode for iOS development and/or Android Studio for Android.

## Step 2 — install packages

```bash
npm install
npx expo install --fix
```

If starting from a fresh Expo app instead, use:

```bash
npx create-expo-app@latest RideSafe
cd RideSafe
npx expo install expo-router expo-audio expo-battery expo-crypto expo-linking expo-location expo-notifications expo-secure-store expo-sqlite expo-task-manager react-native-safe-area-context react-native-screens
npm install @supabase/supabase-js react-native-url-polyfill
```

Then copy the `app`, `components`, `lib`, and `assets` folders from this starter.

## Step 3 — create Supabase project

1. Create a Supabase project.
2. In Authentication settings, enable **Anonymous Sign-Ins**.
3. Open SQL Editor and run `supabase/schema.sql`.
4. Copy your Project URL and anon/publishable key.

Create `.env` from `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
EXPO_PUBLIC_VIEWER_URL=https://YOUR_DOMAIN/viewer
```

## Step 4 — host the viewer page

`viewer/index.html` is deliberately framework-free so it can be hosted almost anywhere (Netlify, Vercel static hosting, Cloudflare Pages, GitHub Pages, etc.).

Before deployment replace:

```js
const SUPABASE_URL='REPLACE_WITH_SUPABASE_URL';
const ANON_KEY='REPLACE_WITH_SUPABASE_ANON_KEY';
```

Then set `EXPO_PUBLIC_VIEWER_URL` to the public URL of that page.

## Step 5 — run locally

Basic UI / fake calls:

```bash
npx expo start
```

For background location on a physical iPhone or Android device, create a development build:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform ios
# or
 eas build --profile development --platform android
```

Install the development build on the phone, then run:

```bash
npx expo start --dev-client
```

## Step 6 — test in this order

1. Settings → choose English or Armenian.
2. Settings → save one trusted safety contact.
3. Fake Call → Now → Answer.
4. Fake Call → 30 sec → tap the notification.
5. Call Me → verify prepared SMS.
6. Share Location → grant location permissions → share link → open link on another phone.
7. Lock the phone / background the app and confirm the browser still receives updates.
8. I Feel Unsafe → verify sharing starts and SMS is prepared.
9. Emergency → verify 112 opens in Phone and alert-contact flow works.
10. Start Safe Ride → share the tracking link → End Ride.

## Step 7 — replace prototype recordings

Replace these files without changing their names:

```text
assets/audio/en/p1.wav
assets/audio/en/p2.wav
assets/audio/en/p3.wav
assets/audio/hy/p1.wav
assets/audio/hy/p2.wav
assets/audio/hy/p3.wav
```

Suggested English script:

1. “Hey, where are you?”
2. “Okay, how much longer?”
3. “Alright. I'll come outside and wait for you.”

Suggested Armenian script:

1. “Որտե՞ղ ես։”
2. “Լավ, ինչքա՞ն մնաց։”
3. “Լավ, ես դուրս կգամ քեզ սպասեմ։”

## Step 8 — production work before public release

- Have Armenian-speaking women test wording and behavior.
- Replace synthesized audio with human recordings and obtain clear consent/releases from voice actors.
- Add privacy policy and retention controls.
- Add automatic deletion of old location sessions.
- Add server-side rate limiting and abuse monitoring.
- Consider a dedicated SMS/push provider for automatic safety alerts.
- Perform iOS/Android background-location testing across poor connectivity, battery saver, force-quit, and reboot cases.
- Obtain legal/privacy review in Armenia before storing or transmitting sensitive location data.
- Do not market any route or behavior as guaranteeing safety.

## File map

```text
app/index.tsx                Home / five primary actions
app/fake-call.tsx            Caller + delay selection
app/fake-incoming.tsx        In-app incoming call screen
app/fake-conversation.tsx    Offline prerecorded prompt playback
app/share-location.tsx       Starts/stops live sharing
app/unsafe.tsx               Unsafe alert flow
app/emergency.tsx            112 + emergency contact
app/safe-ride.tsx            Optional Safe Ride mode
app/more.tsx                 Extra safety tools
app/safety-timer.tsx         Local check-in reminder
app/alarm.tsx                Loud alarm
app/quick-messages.tsx       Preset messages
app/settings.tsx             Language/contact/discreet mode
lib/backgroundLocation.ts    Background GPS uploader + battery event
lib/location.ts              Safety sessions and sharing
lib/i18n.ts                  English/Armenian strings
lib/storage.ts               Local settings
lib/supabase.ts              Supabase client + anonymous auth
supabase/schema.sql          Database, RLS and share-token RPCs
viewer/index.html            No-install browser tracking page
```
