import React from 'react';
import type { SeoMeta } from '../../types/home.types';

interface HeadProps extends SeoMeta {
  children?: React.ReactNode;
}

export default function Head({ title, description, canonical, ogImage, children }: HeadProps) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      {ogImage    && <meta property="og:image"  content={ogImage} />}
      {canonical  && <meta property="og:url"    content={canonical} />}
      <meta property="og:site_name"   content="Discover Karabakh" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
        rel="stylesheet"
      />

      {/* Page-specific tags injected here */}
      {children}
    </head>
  );
}
