/**
 * Karabakh and main Azerbaijani city name mappings for multilingual search optimization.
 */
const CITY_VARIANTS = {
    'Şuşa': ['Shusha', 'Шуша'],
    'Ağdam': ['Agdam', 'Агдам'],
    'Füzuli': ['Fuzuli', 'Физули'],
    'Cəbrayıl': ['Jabrayil', 'Джебраил'],
    'Zəngilan': ['Zangilan', 'Зангилан'],
    'Qubadlı': ['Gubadly', 'Губадлы'],
    'Kəlbəcər': ['Kalbajar', 'Кельбаджар'],
    'Laçın': ['Lachin', 'Лачин'],
    'Xankəndi': ['Khankendi', 'Ханкенди'],
    'Xocalı': ['Khojaly', 'Ходжалы'],
    'Xocavənd': ['Khojavend', 'Ходжавенд'],
    'Ağdərə': ['Agdere', 'Агдара'],
    'Hadrut': ['Hadrut', 'Гадрут'],
    'Bakı': ['Baku', 'Баку'],
    'Gəncə': ['Ganja', 'Гянджа']
};

/**
 * Automatically generates a string of keywords based on the input name and existing keywords.
 * @param {string} name - The main name of the attraction/entity.
 * @param {string} [existingKeywords] - Existing keywords provided by the user.
 * @returns {string} - Concatenated keywords.
 */
export const generateKeywords = (name, existingKeywords = '') => {
    const keywordsSet = new Set();

    // 1. Add the name itself
    keywordsSet.add(name.trim());

    // 2. Lookup city variants
    for (const [az, variants] of Object.entries(CITY_VARIANTS)) {
        if (name.includes(az)) {
            variants.forEach(v => keywordsSet.add(v));
        }
        // Also check if the name is one of the variants and add others
        variants.forEach(v => {
            if (name.includes(v)) {
                keywordsSet.add(az);
                variants.forEach(ov => keywordsSet.add(ov));
            }
        });
    }

    // 3. Add existing keywords if any
    if (existingKeywords) {
        existingKeywords.split(',').forEach(k => keywordsSet.add(k.trim()));
    }

    return Array.from(keywordsSet).join(', ');
};

/**
 * Creates a URL-friendly slug from a string.
 * @param {string} text - The input text.
 * @returns {string} - The generated slug.
 */
export const slugify = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '');     // Trim - from end of text
};
