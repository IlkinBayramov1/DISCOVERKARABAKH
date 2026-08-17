export const getImageUrl = (url?: string, fallback = '/uploads/no-image.svg'): string => {
    if (!url) return fallback === '/uploads/no-image.svg' ? getImageUrl(fallback) : fallback;
    if (typeof url !== 'string') return fallback === '/uploads/no-image.svg' ? getImageUrl(fallback) : fallback;

    // Convert any legacy hardcoded localhost/127.0.0.1 URLs saved in DB to clean path
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        url = url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    if (url.startsWith('/images/')) {
        return url;
    }

    const cleanPath = url.startsWith('/') ? url : `/${url}`;

    let apiOrigin = '';

    if (import.meta.env.VITE_API_URL) {
        try {
            const parsed = new URL(import.meta.env.VITE_API_URL).origin;
            if (!parsed.includes('localhost') && !parsed.includes('127.0.0.1')) {
                apiOrigin = parsed;
            }
        } catch (e) {
            // fallback
        }
    }

    if (!apiOrigin && typeof window !== 'undefined') {
        const origin = window.location.origin;
        if (origin.includes('vercel.app')) {
            apiOrigin = 'http://191.218.163.50';
        } else if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
            apiOrigin = origin;
        } else {
            apiOrigin = 'http://191.218.163.50';
        }
    }

    if (!apiOrigin) {
        apiOrigin = 'http://191.218.163.50';
    }

    return `${apiOrigin}${cleanPath}`;
};
