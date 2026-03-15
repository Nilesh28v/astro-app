# Subscription & Monetization Setup

## Overview

The app uses a **subscription-based model** where most features are free, with select premium features behind a Pro subscription.

## What's Monetized (Pro Features)

| Feature | Description |
|--------|-------------|
| **Pro Tips** | Advanced performance tips in the Explore tab |
| **Pro Modal** | Advanced features in the modal screen |

**Everything else remains free.**

## Architecture

- **`lib/subscription/`** – Subscription context, types, and paywall logic
- **`lib/api/client.ts`** – Backend API client for subscription validation
- **`components/pro-collapsible.tsx`** – Wrapper for paywalled content
- **`useSubscription()`** – Hook for checking access and opening paywall

## Behavior

### Development (Expo Go)

- **IAP not available** – Subscription checks hit `/api/subscription/status`
- When API is not configured: treats user as **free**
- Tapping Pro content shows paywall; "Unlock" grants access in dev (mock mode)

### Production (Dev Client / EAS Build)

- Wire **RevenueCat** (`react-native-purchases`) when ready
- Use `SubscriptionProvider` to integrate purchase flow
- Backend `/api/subscription/status` can validate receipts

## Backend Integration

1. Add `EXPO_PUBLIC_API_BASE_URL` to `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
   ```

2. Implement endpoint `GET /api/subscription/status`:
   - Response: `{ tier: "free" | "pro" }`
   - Use auth token or user ID from the request to look up status

3. For full IAP, add RevenueCat and server-side receipt validation.

## Adding New Pro Features

1. Add to `lib/subscription/types.ts`:
   ```ts
   export type ProFeature = 'pro_tips' | 'pro_modal' | 'your_new_feature';
   ```

2. Use `ProCollapsible` for sections or `useSubscription().hasAccess('your_new_feature')` for custom UI.
