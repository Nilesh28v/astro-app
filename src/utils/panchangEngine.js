/**
 * Panchang Engine — Local, offline calculation of daily Hindu calendar elements.
 * Calculates: Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Gulika Kaal
 */

const TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const TITHI_NAMES_HI = [
    'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
    'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
    'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
    'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
    'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
    'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'
];

const NAKSHATRA_NAMES = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRA_NAMES_HI = [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा',
    'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा',
    'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती',
    'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा',
    'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
    'पूर्वा भाद्रपदा', 'उत्तरा भाद्रपदा', 'रेवती'
];

const YOGA_NAMES = [
    'Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const YOGA_NAMES_HI = [
    'विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन',
    'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड',
    'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
    'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव',
    'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'
];

const KARANA_NAMES = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
];

const KARANA_NAMES_HI = [
    'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि',
    'शकुनि', 'चतुष्पद', 'नाग', 'किंस्तुघ्न'
];

const RAHU_KAAL = [7, 1, 6, 4, 5, 3, 2];
const GULIKA_KAAL = [6, 5, 4, 3, 2, 1, 0];

const getJD = (date) => {
    let y = date.getUTCFullYear(), m = date.getUTCMonth() + 1;
    const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
    if (m <= 2) { y--; m += 12; }
    const A = Math.floor(y / 100);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + 2 - A + Math.floor(A / 4) - 1524.5;
};

const getSunLong = (jd) => {
    const t = (jd - 2451545.0) / 36525.0;
    const L = 280.46646 + 36000.76983 * t, M = (357.52911 + 35999.05029 * t) * Math.PI / 180;
    const C = (1.914602 - 0.004817 * t) * Math.sin(M) + 0.019993 * Math.sin(2 * M);
    return ((L + C) % 360 + 360) % 360;
};

const getMoonLong = (jd) => {
    const t = (jd - 2451545.0) / 36525.0;
    const L = 218.3165 + 481267.8813 * t, D = (297.8502 + 445267.1115 * t) * Math.PI / 180;
    const M = (357.5291 + 35999.0503 * t) * Math.PI / 180, Mp = (134.9634 + 477198.8676 * t) * Math.PI / 180;
    const F = (93.2720 + 483202.0175 * t) * Math.PI / 180;
    const lon = L + 6.289 * Math.sin(Mp) + 1.274 * Math.sin(2 * D - Mp) + 0.658 * Math.sin(2 * D) + 0.214 * Math.sin(2 * Mp) - 0.186 * Math.sin(M) - 0.114 * Math.sin(2 * F);
    return ((lon % 360) + 360) % 360;
};

const getAyanamsha = (jd) => {
    const t = (jd - 2451545.0) / 36525.0;
    return 22.46664 + 1.39746 * t + 0.00043 * t * t;
};

export const calculatePanchang = (date = new Date(), lang = 'en') => {
    const jd = getJD(date);
    const ay = getAyanamsha(jd);
    const sunL = ((getSunLong(jd) - ay) % 360 + 360) % 360;
    const moonL = ((getMoonLong(jd) - ay) % 360 + 360) % 360;
    const elong = ((moonL - sunL) % 360 + 360) % 360;

    const ti = Math.floor(elong / 12);
    const ni = Math.floor(moonL / (360 / 27));
    const yi = Math.floor(((sunL + moonL) % 360 + 360) % 360 / (360 / 27));
    const ki = Math.floor(elong / 6);

    const paksha = ti < 15 
        ? (lang === 'hi' ? 'शुक्ल पक्ष' : 'Shukla Paksha') 
        : (lang === 'hi' ? 'कृष्ण पक्ष' : 'Krishna Paksha');
        
    const KARANA_ARRAY = lang === 'hi' ? KARANA_NAMES_HI : KARANA_NAMES;
    const TITHI_ARRAY = lang === 'hi' ? TITHI_NAMES_HI : TITHI_NAMES;
    const NAKSHATRA_ARRAY = lang === 'hi' ? NAKSHATRA_NAMES_HI : NAKSHATRA_NAMES;
    const YOGA_ARRAY = lang === 'hi' ? YOGA_NAMES_HI : YOGA_NAMES;

    const karana = ki === 0 ? KARANA_ARRAY[10] : ki >= 57 ? KARANA_ARRAY[7 + (ki - 57)] : KARANA_ARRAY[(ki - 1) % 7];

    const dow = date.getDay();
    const fmt = (h) => {
        const hr = Math.floor(h), mn = Math.round((h - hr) * 60);
        const p = hr >= 12 ? (lang === 'hi' ? 'दोपहर' : 'PM') : (lang === 'hi' ? 'पूर्वाह्न' : 'AM');
        return `${hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr)}:${String(mn).padStart(2, '0')} ${p}`;
    };
    const rs = 6 + RAHU_KAAL[dow] * 1.5, gs = 6 + GULIKA_KAAL[dow] * 1.5;

    const badYogas = ['Vishkambha', 'Atiganda', 'Shoola', 'Ganda', 'Vyaghata', 'Vajra', 'Vyatipata', 'Parigha', 'Vaidhriti'];

    return {
        tithi: `${paksha} ${TITHI_ARRAY[ti % 30]}`,
        tithiNumber: (ti % 15) + 1,
        paksha,
        nakshatra: NAKSHATRA_ARRAY[ni % 27],
        yoga: YOGA_ARRAY[yi % 27],
        karana,
        rahuKaal: `${fmt(rs)} – ${fmt(rs + 1.5)}`,
        gulikaKaal: `${fmt(gs)} – ${fmt(gs + 1.5)}`,
        isAuspicious: !badYogas.includes(YOGA_NAMES[yi % 27]) && (ki === 0 ? KARANA_NAMES[10] : ki >= 57 ? KARANA_NAMES[7 + (ki - 57)] : KARANA_NAMES[(ki - 1) % 7]) !== 'Vishti',
        dayOfWeek: lang === 'hi' 
            ? ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'][dow]
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dow],
    };
};

export const getDailyTip = (date = new Date()) => {
    const tips = [
        { tip: 'Offer water to the Sun at sunrise while chanting "Om Suryaya Namah" for vitality.', icon: '☀️' },
        { tip: 'Light a ghee lamp before your deity and meditate for 10 minutes.', icon: '🪔' },
        { tip: 'Chant "Om Namah Shivaya" 108 times for spiritual strength.', icon: '🙏' },
        { tip: 'Feed birds with grain today — it removes malefic planetary effects.', icon: '🐦' },
        { tip: 'Read one shloka from the Bhagavad Gita and contemplate its meaning.', icon: '📖' },
        { tip: 'Donate food or clothes to the needy. Charity multiplies karma ten-fold.', icon: '🤲' },
        { tip: 'Apply a tilak of sandalwood before stepping out for divine protection.', icon: '🔴' },
        { tip: 'Take 5 deep breaths facing the East at dawn to charge your prana.', icon: '🌅' },
        { tip: 'Water a Tulsi plant and circumambulate it. Tulsi worship pleases Lord Vishnu.', icon: '🌿' },
        { tip: 'Practice silence (Mauna) for one hour today. Quietness reveals guidance.', icon: '🤫' },
        { tip: 'Offer Jal to a Peepal tree to honor ancestors and reduce Pitru Dosha.', icon: '🌳' },
        { tip: 'Light camphor and inhale. Camphor purifies the aura and removes negativity.', icon: '🔥' },
        { tip: 'Recite Hanuman Chalisa before a difficult task for courage.', icon: '💪' },
        { tip: 'Place copper vessel of water under moonlight. Drink at dawn for clarity.', icon: '🌙' },
        { tip: 'Practice gratitude by thanking 5 people in your life today.', icon: '✨' },
        { tip: 'Keep your wallet clean and organized — it invites Lakshmi.', icon: '💰' },
        { tip: 'Offer marigold garlands to your deity. Marigold is beloved by Devas.', icon: '🌼' },
        { tip: 'Listen to or chant Gayatri Mantra at dusk for wisdom.', icon: '🕉️' },
        { tip: 'Eat sitting on the floor if possible — this Vedic practice improves digestion.', icon: '🍽️' },
        { tip: 'Keep a glass of water on your desk. It absorbs negative energy.', icon: '💧' },
        { tip: 'Wear white today for mental peace and positive vibrations.', icon: '👔' },
        { tip: 'Offer curd-rice (Dahi-Chawal) before a new venture for a sweet start.', icon: '🍚' },
        { tip: 'Light a diya with sesame oil in the evening to reduce Saturn effects.', icon: '🪔' },
        { tip: 'Touch elders feet today. Their blessings remove astrological afflictions.', icon: '🙇' },
        { tip: 'Before sleeping, mentally forgive everyone. This releases karmic bonds.', icon: '😌' },
        { tip: 'Sprinkle Gangajal at home entrance to ward off negative energies.', icon: '🚪' },
        { tip: 'Chant "Om Gan Ganapataye Namah" before new work for Ganesha blessings.', icon: '🐘' },
        { tip: 'Do Surya Namaskar at sunrise — physical exercise with spiritual devotion.', icon: '🧘' },
        { tip: 'Keep lemon and green chillies at your entrance against evil eye.', icon: '🍋' },
        { tip: 'Offer flowers to flowing water while praying to Goddess Ganga.', icon: '🌊' },
        { tip: 'Place a Shri Yantra in your puja room for prosperity blessings.', icon: '🔱' },
    ];
    const doy = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return tips[doy % tips.length];
};
