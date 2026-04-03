/**
 * Content Service — API-first content fetching with cache and local fallback.
 *
 * Pattern:
 *   1. Check AsyncStorage cache (< 24h old → use it)
 *   2. Try API fetch → cache result in AsyncStorage
 *   3. If API fails → fall back to local hardcoded data
 *
 * This ensures:
 *   - Instant content on first open (cache or local)
 *   - Fresh content when online (API → cache)
 *   - Full offline support (local fallback)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_PREFIX = 'content_cache_';

// ─── CACHE HELPERS ─────────────────────────────────

async function getCache(key) {
    try {
        const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp > CACHE_TTL) return null; // Expired
        return data;
    } catch {
        return null;
    }
}

async function setCache(key, data) {
    try {
        await AsyncStorage.setItem(
            CACHE_PREFIX + key,
            JSON.stringify({ data, timestamp: Date.now() })
        );
    } catch {
        // Cache write failed — non-critical
    }
}

// ─── API FETCH WITH TIMEOUT ───────────────────────

async function apiFetch(endpoint, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        // Remove '/api' if the API_URL already has it and endpoint starts with /content
        const baseUrl = API_URL.replace(/\/api\/?$/, '');
        const url = `${baseUrl}/api/content${endpoint}`;
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

// ═══════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════

/**
 * Get the daily spiritual tip.
 * Returns: { icon: string, tip: string }
 */
export async function fetchDailyTip(localFallbackFn) {
    // 1. Check cache
    const cached = await getCache('daily_tip');
    if (cached) return cached;

    // 2. Try API
    try {
        const response = await apiFetch('/daily-tip');
        if (response.tip) {
            const tip = {
                icon: response.tip.icon || '🙏',
                tip: response.tip.tip_en,
                tip_hi: response.tip.tip_hi,
            };
            await setCache('daily_tip', tip);
            return tip;
        }
    } catch {
        // API unavailable
    }

    // 3. Local fallback
    if (localFallbackFn) return localFallbackFn();
    return { icon: '🙏', tip: 'Start your day with gratitude and prayer.' };
}

/**
 * Get remedies for a zodiac sign.
 * Returns the same structure as REMEDIES_DATA[sign]
 */
export async function fetchRemedies(sign, lang = 'en', localFallback = null) {
    const cacheKey = `remedies_${sign}_${lang}`;
    
    // 1. Cache
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    // 2. API
    try {
        const response = await apiFetch(`/remedies/${sign}?lang=${lang}`);
        if (response.remedy) {
            const r = response.remedy;
            // Transform DB format to match the local data format the UI expects
            const formatted = {
                sign: r.sign_name,
                symbol: r.symbol,
                element: r.element,
                ruler: r.ruler,
                gemstone: r.gemstone,
                mantras: r.mantras,
                donations: r.donations,
                fasting: r.fasting,
                colors: r.colors,
                lifestyle: r.lifestyle,
                commonRemedies: r.common_remedies,
            };
            await setCache(cacheKey, formatted);
            return formatted;
        }
    } catch {
        // API unavailable
    }

    // 3. Local fallback
    return localFallback;
}

/**
 * Get all ekadashi dates.
 * Returns array in same format as EKADASHI_DATA
 */
export async function fetchEkadashiDates(localFallback = []) {
    const cacheKey = 'ekadashi_all';
    
    // 1. Cache
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    // 2. API
    try {
        const response = await apiFetch('/ekadashi');
        if (response.ekadashi && response.ekadashi.length > 0) {
            // Transform to match local EKADASHI_DATA format
            const formatted = response.ekadashi.map((ek, idx) => ({
                id: ek.id || idx + 1,
                date: ek.date.split('T')[0], // Ensure YYYY-MM-DD format
                name: ek.name_en,
                name_hi: ek.name_hi,
                significance: ek.significance_en,
                significance_hi: ek.significance_hi,
                remedies: ek.remedies_en,
                remedies_hi: ek.remedies_hi,
                dosAndDonts: ek.dos_and_donts_en,
                dosAndDonts_hi: ek.dos_and_donts_hi,
            }));
            await setCache(cacheKey, formatted);
            return formatted;
        }
    } catch {
        // API unavailable
    }

    // 3. Local fallback
    return localFallback;
}

/**
 * Get the next upcoming ekadashi.
 * Returns { next: {...}, upcoming: [...] }
 */
export async function fetchUpcomingEkadashi(localFallbackData = []) {
    // Try API first for the freshest data
    try {
        const response = await apiFetch('/ekadashi/upcoming');
        if (response.next) {
            const format = (ek) => ({
                id: ek.id,
                date: ek.date.split('T')[0],
                name: ek.name_en,
                name_hi: ek.name_hi,
                significance: ek.significance_en,
                significance_hi: ek.significance_hi,
                remedies: ek.remedies_en,
                remedies_hi: ek.remedies_hi,
                dosAndDonts: ek.dos_and_donts_en,
                dosAndDonts_hi: ek.dos_and_donts_hi,
            });
            return {
                next: format(response.next),
                upcoming: (response.upcoming || []).map(format),
            };
        }
    } catch {
        // API unavailable — use local
    }

    // Fallback: compute from local data
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = localFallbackData.filter(e => e.date >= todayStr);
    return {
        next: upcoming[0] || null,
        upcoming: upcoming.slice(0, 3),
    };
}

/**
 * Clear all content caches (useful for debugging or forced refresh)
 */
export async function clearContentCache() {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const contentKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
        await AsyncStorage.multiRemove(contentKeys);
    } catch {
        // Non-critical
    }
}
