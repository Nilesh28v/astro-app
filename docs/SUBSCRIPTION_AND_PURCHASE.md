# Where is subscription and how to purchase

## Where to find it in the app

1. **More tab** (bottom tab bar) → open **More**
2. At the **top** you’ll see a **SUBSCRIPTION** section with:
   - **“Subscribe to Jyotish Pro”** (if you’re on free)  
   - **“Jyotish Pro (Active)”** (if you’re Pro)
3. Tap that row to open the **subscription / paywall** screen.

You can also hit Pro content (e.g. **Pro Tips** in Explore, or Pro features in modals); that will open the same paywall.

---

## How “purchase” works right now

- **In development (Expo Go / dev build):**  
  There is **no real payment**. Tapping **“Unlock Pro (test)”** or **“Subscribe — choose plan”** just marks you as Pro for this session so you can test Pro features.
- **Real purchase** is not wired yet. To add it you need in‑app purchases (Apple/Google) or a service like **RevenueCat**.

---

## How to add real purchase later

1. **Use RevenueCat (recommended)**  
   - Add `react-native-purchases` and create a dev build (not Expo Go).  
   - In `lib/subscription/context.tsx`, in `PaywallModal` → `handleUnlock`, replace the current logic with RevenueCat’s purchase/restore flow.  
   - RevenueCat will show the real paywall with plans and prices.

2. **Backend**  
   - Your backend already has `GET /api/subscription/status`.  
   - After a successful purchase, your app (or webhook) should update the `subscriptions` table so this endpoint returns `tier: 'pro'`.

3. **Where the code lives**  
   - Subscription state & paywall UI: `lib/subscription/context.tsx`  
   - Entry point in UI: **More** tab → **MoreMenuScreen.js** (SUBSCRIPTION section)  
   - API client: `lib/api/client.ts`  
   - Backend endpoint: `astro-api` → `GET /api/subscription/status`

---

## Summary

| What            | Where |
|-----------------|--------|
| Open subscription / purchase | **More** tab → first row under **SUBSCRIPTION** |
| Paywall / “Subscribe” screen  | Opens when you tap that row or any locked Pro feature |
| Real payment                  | Not implemented yet; add via RevenueCat / IAP and wire it in `handleUnlock` in `lib/subscription/context.tsx` |
