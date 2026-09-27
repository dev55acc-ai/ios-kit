# Installing your apps on your own iPhone — for free

The $99/yr Apple Developer Program is **not** required to build premium apps for
yourself. It is only required to *distribute* (App Store, TestFlight, ad-hoc to
other people's devices). Everything below is $0.

## Option 1 — Expo Go (free, works today, no caveats for your use case)

Expo Go is a real app on your phone. Your app runs inside it, from a dev server,
with no signing, no Apple account, no expiry, no 7-day refresh.

```
iosapp run ~/apps/myapp     # prints a QR — scan with the Camera app
```

This is the right answer for "premium apps for myself". The limits are only the
ones that matter for distribution: no App Store, no TestFlight, no push in some
cases, and the app runs from a dev server (so the laptop needs to be awake — or
use the tunnel, which I run for you).

## Option 2 — SideStore / AltStore (free Apple ID, 7-day auto refresh)

Installs a real standalone app with its own icon. Costs nothing. The app expires
every 7 days, and the tool **re-signs it automatically in the background** as long
as you run the desktop helper once a week.

- SideStore: https://sidestore.co — pairs over Wi-Fi, refreshes on-device
- AltStore: https://altstore.io — Windows/macOS helper, refreshes while running

Your desktop is Windows, so AltStore/SideStore both work there. You need your
Apple ID but **not** a paid membership.

**The catch, and it is real:** installing an `.ipa` this way requires a **device**
build (arm64), and a device `.ipa` has to be compiled by Xcode — which only runs
on macOS. So you need *a* Mac: your own, a used Mac mini (often cheaper than $99
in total cost), or a rented cloud Mac for one hour. With a Mac + free Apple ID,
Xcode's automatic signing produces a device `.ipa` for your own phone. Free,
forever, no subscription.

## Option 3 — TrollStore (free, permanent, no re-signing, no jailbreak)

Exploits a CoreTrust bug so installed apps never expire. Free and permanent.

**Supported only on:** iOS 14.0 β2 – 16.6.1, iOS 16.7 RC, and iOS 17.0.
**Not supported on:** iOS 17.0.1+, iOS 18+, iOS 26, or any A17 Pro / A18 / A19
device.

So: check `Settings → General → About → iOS Version` first. If you're on 17.0 or
lower, you can install any `.ipa` permanently with zero accounts and zero signing.
If you're on 17.0.1 or newer, TrollStore is not an option and never will be.

## Option 4 — Jailbreak: not the answer

Jailbreaking does not remove the code-signing requirement for normal apps, and
there is no jailbreak for modern hardware on current iOS. It adds risk (a wrong
exploit bricks the phone) and buys nothing you need here. Skip it.

## Decision

| If you want | Use | Cost |
|---|---|---|
| Apps running on your phone, now, zero friction | **Option 1 (Expo Go)** | $0 |
| A standalone app with its own icon, no subscription | **Option 2** (needs any Mac, one time) | $0 |
| Permanent install, never re-sign | **Option 3** (only if iOS ≤ 17.0) | $0 |
| TestFlight / App Store / anyone else's phone | Apple Developer Program | $99/yr |

Start with Option 1. If you later want the standalone icon, buy a $200 used
Mac mini — that is cheaper than the developer program over two years and it also
gives you a local build loop that is faster than EAS.
