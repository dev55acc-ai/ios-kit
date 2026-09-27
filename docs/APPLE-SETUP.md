# One-time Apple signing setup (you do this once, ever)

EAS builds a real `.ipa` for your iPhone only if it can sign with your Apple
Developer account. This is the single human step in the whole pipeline — it
cannot be automated because it needs your Apple ID and 2FA.

## 1. Get a Team ID (5 min, once)

1. Sign in at https://developer.apple.com/account
2. You need the **Membership** tab to show an active team. If it says your
   membership is expired or you have no team, that's the real blocker — pay for
   the programme (or reactivate it) first.
3. Copy your **Team ID** (10 characters, e.g. `A1B2C3D4E5`) from Membership.

## 2. Make an app-specific password (2 min, once)

1. https://developer.apple.com/account/resources → Keys → App Store Connect API
   is *not* what you want. You want: **App IDs → App-Specific Passwords →
   Create a new password**.
2. Name it `iosapp` and copy the generated `xxxx-xxxx-...` string. Apple shows it
   exactly once.

## 3. Give it to the machine (once)

Append to `~/.secrets/expo-token.env`:

```
export EXPO_APPLE_ID="your-apple-id@example.com"
export EXPO_APPLE_TEAM_ID="A1B2C3D4E5"
export EXPO_APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export EXPO_APPLE_APP_SPECIFIC_EXPO_PASSWORD="xxxx-xxxx-xxxx-xxxx"
```

Then `source ~/.secrets/expo-token.env`.

## 4. Build

```
iosapp build ~/apps/myapp preview
```

First build registers a bundle ID in your Apple account and creates a
provisioning profile. It is slow the first time (10–20 min) and fast after.

## If you skip this

`iosapp sim ~/apps/myapp` builds a **simulator** `.app` with no Apple account at
all. It proves the whole pipeline compiles and boots, but it installs in the iOS
Simulator on macOS, not on your phone. Note: EAS simulator builds need no
credentials, so this is the right way to verify a build is green before you
invest the signing setup.

## Troubleshooting

- **"couldn't find credentials suitable for internal distribution"** — steps 1–3
  above are incomplete; the machine has no Apple credentials.
- **2FA prompt during build** — EAS needs your Apple ID's *app-specific
  password* (step 2), never your real password.
- **Provisioning profile error** — usually a paid-account/Team-ID mismatch.
  `npx eas-cli credentials` shows what EAS has stored.
