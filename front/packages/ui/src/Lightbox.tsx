import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import './Lightbox.css';

interface LightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose }) => {
    const [index, setIndex] = useState(currentIndex);
    const [zoom, setZoom] = useState(1);

    // Preload next/prev images
    useEffect(() => {
        if (images.length === 0) return;
        const preload = (src: string) => {
            const img = new Image();
            img.src = src;
        };
        const nextIdx = (index + 1) % images.length;
        const prevIdx = (index - 1 + images.length) % images.length;
        preload(images[nextIdx]);
        preload(images[prevIdx]);
    }, [index, images]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index, images]);

    const handleNext = () => {
        if (images.length <= 1) return;
        setIndex((prev) => (prev + 1) % images.length);
        setZoom(1);
    };

    const handlePrev = () => {
        if (images.length <= 1) return;
        setIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoom(1);
    };

    const toggleZoom = () => {
        setZoom((prev) => (prev === 1 ? 1.8 : 1));
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="dk-lightbox-overlay" onClick={onClose}>
            {/* Top Toolbar */}
            <div className="dk-lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
                <span className="dk-lightbox-counter">
                    {index + 1} / {images.length}
                </span>
                <div className="dk-lightbox-actions">
                    <button 
                        className="dk-lightbox-btn" 
                        onClick={toggleZoom} 
                        title="Böyüt / Kiçilt"
                    >
                        {zoom === 1 ? <ZoomIn size={20} /> : <ZoomOut size={20} />}
                    </button>
                    <button 
                        className="dk-lightbox-btn close-btn" 
                        onClick={onClose} 
                        title="Bağla"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="dk-lightbox-stage" onClick={onClose}>
                {images.length > 1 && (
                    <button 
                        className="dk-lightbox-nav-btn prev" 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    >
                        <ChevronLeft size={36} />
                    </button>
                )}

                <div 
                    className="dk-lightbox-image-container"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img 
                        src={images[index]} 
                        alt={`Document Preview ${index + 1}`} 
                        className="dk-lightbox-img"
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>

                {images.length > 1 && (
                    <button 
                        className="dk-lightbox-nav-btn next" 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    >
                        <ChevronRight size={36} />
                    </button>
                )}
            </div>
        </div>
    );
};
