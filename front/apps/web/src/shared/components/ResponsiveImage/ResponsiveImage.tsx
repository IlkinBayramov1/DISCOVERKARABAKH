import React from 'react';

export interface ImageConfig {
    name: string;      // Image base name e.g. "shusha"
    alt: string;
    width: number;     // Mandatory width to avoid CLS
    height: number;    // Mandatory height to avoid CLS
    fallbackUrl?: string; // Optional direct fallback URL if local variants aren't ready
}

export interface ResponsiveImageProps {
    image: ImageConfig;
    className?: string;
    style?: React.CSSProperties;
    isHero?: boolean;  // Apply ONLY to 1 LCP Hero image per page
    sizes?: string;    // Contextual layout size string
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
    image,
    className,
    style,
    isHero = false,
    sizes = "(max-width: 768px) 100vw, 600px"
}) => {
    // If fallbackUrl is provided and name is empty/external URL
    if (image.fallbackUrl && (!image.name || image.fallbackUrl.startsWith('http'))) {
        return (
            <img
                src={image.fallbackUrl}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={className}
                style={style}
                loading={isHero ? "eager" : "lazy"}
                fetchPriority={isHero ? "high" : "auto"}
                decoding="async"
            />
        );
    }

    const basePath = `/images/${image.name}`;

    return (
        <picture className={className} style={style}>
            <source
                type="image/avif"
                srcSet={`${basePath}-400.avif 400w, ${basePath}-800.avif 800w, ${basePath}-1200.avif 1200w`}
                sizes={sizes}
            />
            <source
                type="image/webp"
                srcSet={`${basePath}-400.webp 400w, ${basePath}-800.webp 800w, ${basePath}-1200.webp 1200w`}
                sizes={sizes}
            />
            <img
                src={`${basePath}-800.jpg`}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={className}
                style={style}
                loading={isHero ? "eager" : "lazy"}
                fetchPriority={isHero ? "high" : "auto"}
                decoding="async"
            />
        </picture>
    );
};

export default ResponsiveImage;
