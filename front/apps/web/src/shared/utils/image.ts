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

    if (typeof window !== 'undefined') {
        apiOrigin = window.location.origin;
    }

    if (import.meta.env.VITE_API_URL) {
        try {
            apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
        } catch (e) {
            // fallback
        }
    }

    return `${apiOrigin}${cleanPath}`;
};
