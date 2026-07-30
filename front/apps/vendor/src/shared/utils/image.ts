export const getImageUrl = (url?: string, fallback = 'https://placehold.co/600x400?text=No+Image'): string => {
    if (!url) return fallback;
    if (typeof url !== 'string') return fallback;
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
            apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
        } catch (e) {
            // fallback
        }
    }

    if (!apiOrigin && typeof window !== 'undefined') {
        if (window.location.origin.includes('vercel.app')) {
            apiOrigin = 'http://191.218.163.50:4004';
        } else {
            apiOrigin = window.location.origin;
        }
    }

    return `${apiOrigin}${cleanPath}`;
};
