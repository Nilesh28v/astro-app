/**
 * Subscription types.
 * Defines what is free vs premium.
 */

export type SubscriptionTier = 'free' | 'pro';

export type ProFeature =
  | 'pro_tips'      // Pro Tips section in Explore
  | 'pro_modal';    // Advanced features in Modal

/** Features that require Pro subscription */
export const PRO_FEATURES: ProFeature[] = ['pro_tips', 'pro_modal'];

/** Check if a feature is behind paywall */
export function isProFeature(feature: string): feature is ProFeature {
  return PRO_FEATURES.includes(feature as ProFeature);
}
