import horoscopeData from '../../assets/data/horoscopeData.json';

const ZODIAC_KEYS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

/**
 * A deterministic seeded random generator based on a string seed.
 * Produces the same output for the same seed every time — so the same
 * zodiac sign sees the same horoscope on the same day across all devices.
 */
const seededRandom = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
};

/**
 * Get the zodiac key from a rashi number (1-indexed).
 */
const getZodiacKey = (rashiNum) => ZODIAC_KEYS[(rashiNum - 1) % 12];

/**
 * Get daily horoscope for a given rashi number.
 * Uses zodiac-specific templates for personalized readings.
 * @param {number} rashiNum - 1 to 12 (Aries=1, Pisces=12)
 * @param {Date} date - defaults to today
 */
export const getDailyHoroscope = (rashiNum, date = new Date()) => {
    const dateString = date.toDateString();
    const zodiacKey = getZodiacKey(rashiNum);
    const zodiacData = horoscopeData[zodiacKey];

    // If zodiac-specific data exists, use it; otherwise fall back to generic
    if (!zodiacData) {
        // Fallback for any missing sign data
        const categories = ['general', 'career', 'love', 'health'];
        const horoscope = {};
        categories.forEach(cat => {
            const templates = horoscopeData[cat] || ['The stars favor your path today.'];
            const seed = `${dateString}-${rashiNum}-${cat}`;
            const index = Math.floor(seededRandom(seed) * templates.length);
            horoscope[cat] = templates[index];
        });
        return horoscope;
    }

    const categories = ['general', 'career', 'love', 'health'];
    const horoscope = {};

    categories.forEach(cat => {
        const templates = zodiacData[cat];
        if (templates && templates.length > 0) {
            const seed = `${dateString}-${zodiacKey}-${cat}`;
            const index = Math.floor(seededRandom(seed) * templates.length);
            horoscope[cat] = templates[index];
        } else {
            horoscope[cat] = 'The cosmic energies are aligning in your favor today.';
        }
    });

    return horoscope;
};

/**
 * Get daily attributes (lucky number, lucky color, mood) for a given rashi.
 */
export const getDailyAttributes = (rashiNum, date = new Date()) => {
    const dateString = date.toDateString();
    const attrs = horoscopeData.dailyAttributes;

    if (!attrs) {
        return { luckyNumbers: [7, 3, 9], luckyColor: 'Gold', mood: 'Optimistic' };
    }

    const numSeed = `${dateString}-${rashiNum}-num`;
    const colorSeed = `${dateString}-${rashiNum}-color`;
    const moodSeed = `${dateString}-${rashiNum}-mood`;

    const numIndex = Math.floor(seededRandom(numSeed) * attrs.luckyNumbers.length);
    const colorIndex = Math.floor(seededRandom(colorSeed) * attrs.luckyColors.length);
    const moodIndex = Math.floor(seededRandom(moodSeed) * attrs.moods.length);

    return {
        luckyNumbers: attrs.luckyNumbers[numIndex],
        luckyColor: attrs.luckyColors[colorIndex],
        mood: attrs.moods[moodIndex],
    };
};

/**
 * Get the zodiac sign name from rashi number.
 */
export const getZodiacName = (rashiNum, lang = 'en') => {
    const namesEn = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const namesHi = [
        'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
        'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
    ];
    return lang === 'hi' ? namesHi[(rashiNum - 1) % 12] : namesEn[(rashiNum - 1) % 12];
};

/**
 * Get zodiac symbol emoji from rashi number or id.
 * Hindi uses Devanagari short names, English uses standard zodiac symbols.
 */
export const getZodiacSymbol = (rashi, lang = 'en') => {
    let index = 0;
    if (typeof rashi === 'number') {
        index = (rashi - 1) % 12;
    } else if (typeof rashi === 'string') {
        index = ZODIAC_KEYS.indexOf(rashi.toLowerCase());
        if (index === -1) index = 0;
    }

    const symbolsEn = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    // Traditional Indian rashi symbols
    const symbolsHi = ['🐏', '🐂', '👫', '🦀', '🦁', '👩', '⚖️', '🦂', '🏹', '🐊', '🏺', '🐟'];
    
    return lang === 'hi' ? symbolsHi[index] : symbolsEn[index];
};
