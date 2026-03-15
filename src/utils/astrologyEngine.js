/**
 * A simplified Astrology Engine for Vedic (Sidereal) Calculations.
 * Note: These are robust approximations for mobile use without heavy ephemeris files.
 * Uses Lahiri Ayanamsha.
 */

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

// Ayanamsha (Lahiri approximation)
const getAyanamsha = (jd) => {
    const t = (jd - 2451545.0) / 36525.0; // Centuries from J2000.0
    return 22.46664 + 1.39746 * t + 0.00043 * t * t; // Simplified Lahiri
};

// Julian Day calculation
const getJD = (date) => {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

    if (month <= 2) {
        year -= 1;
        month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
};

/**
 * Calculates planetary positions and houses.
 * For a production app, one would use a library like 'swisseph', 
 * but here we use a simplified astronomical model for the "Vedic" experience.
 */
export const calculateKundli = (birthDate, lat, lon) => {
    const jd = getJD(birthDate);
    const ayanamsha = getAyanamsha(jd);

    // Simplified planetary calculation (approximate mean positions)
    // In a real app, you'd use more precise orbital elements (Keplerian)
    // Here we provide a realistic mock-up of the results structure

    // Calculate Ascendant (Lagna) based on time and location
    // This is a simplified calculation for demonstration
    const hoursSinceMidnight = birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60;
    const siderialTime = (jd - 2451545.0) * 0.0657098244 + hoursSinceMidnight + lon / 15;
    const lagnaDeg = ((siderialTime * 15 + ayanamsha) % 360 + 360) % 360;
    const lagnaRashi = Math.floor(lagnaDeg / 30) + 1; // 1-indexed (1=Aries)

    // Helper to get planet rashi (1-12)
    const getPlanetRashi = (baseDeg, speed, jd) => {
        const rawDeg = (baseDeg + speed * (jd - 2451545.0) - ayanamsha);
        const deg = ((rawDeg % 360) + 360) % 360;
        return Math.floor(deg / 30) + 1;
    };

    // Approximate speeds and base positions (Simplified)
    const planetsData = {
        Sun: getPlanetRashi(280.46, 0.985647, jd),
        Moon: getPlanetRashi(218.32, 13.176396, jd),
        Mars: getPlanetRashi(355.45, 0.524021, jd),
        Mercury: getPlanetRashi(252.25, 4.092339, jd),
        Jupiter: getPlanetRashi(34.35, 0.083085, jd),
        Venus: getPlanetRashi(181.98, 1.60213, jd),
        Saturn: getPlanetRashi(50.08, 0.033444, jd),
        Rahu: getPlanetRashi(125.12, -0.05295, jd),
        Ketu: ((getPlanetRashi(125.12, -0.05295, jd) + 5) % 12) + 1 // Always 180 deg from Rahu
    };

    // Map planets to houses based on Lagna
    // House 1 starts at Lagna Rashi
    const planetPositions = Object.entries(planetsData).map(([name, rashi]) => {
        let house = (rashi - lagnaRashi + 1);
        while (house <= 0) house += 12;
        while (house > 12) house -= 12;
        return { name, rashi, house };
    });

    // Group planets by house for the chart
    const houses = Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        rashi: ((lagnaRashi + i - 1) % 12) + 1,
        planets: planetPositions.filter(p => p.house === i + 1).map(p => p.name)
    }));

    return {
        lagnaRashi,
        houses,
        planetPositions,
        jd,
        ayanamsha
    };
};

export const getRashiName = (num) => ZODIAC_SIGNS[num - 1];
