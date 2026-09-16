// ─── Progressive Image Component with Zero-CLS & WebP/AVIF Support ────────────
import React, { useEffect, useRef, useState } from 'react';
import { decodeBlurhash } from '../../engine/image/blurhash';
import type { ProductImageSources } from '../../types/product';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  blurhash: string;
  alt: string;
  aspectRatio?: string; // e.g. "3/4"
  sources?: ProductImageSources;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  blurhash,
  alt,
  aspectRatio = '3/4',
  sources,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Decode and Render Blurhash onto Canvas
  useEffect(() => {
    if (!canvasRef.current || !blurhash) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 32;
    const height = Math.round(width * (4 / 3)); // 3:4 aspect ratio
    canvas.width = width;
    canvas.height = height;

    try {
      const pixels = decodeBlurhash(blurhash, width, height);
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    } catch (err) {
      console.error('Failed to decode blurhash:', err);
    }
  }, [blurhash]);

  // 2. IntersectionObserver for Lazy Loading
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // start loading 200px before entering viewport
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Compute responsive Srcset for external or local photos
  const getSrcset = (baseSrc: string) => {
    const match = baseSrc.match(/seed\/(\w+)/);
    if (!match) return undefined;
    const seed = match[1];

    return `
      https://picsum.photos/seed/${seed}/320/427 320w,
      https://picsum.photos/seed/${seed}/640/853 640w,
      https://picsum.photos/seed/${seed}/960/1280 960w,
      https://picsum.photos/seed/${seed}/1280/1706 1280w
    `.trim();
  };

  const avifSrcset = sources?.avif
    ? `${sources.avif['375w']} 375w, ${sources.avif['768w']} 768w, ${sources.avif['1080w']} 1080w`
    : undefined;

  const webpSrcset = sources?.webp
    ? `${sources.webp['375w']} 375w, ${sources.webp['768w']} 768w, ${sources.webp['1080w']} 1080w`
    : undefined;

  const jpegSrcset = sources?.jpeg
    ? `${sources.jpeg['375w']} 375w, ${sources.jpeg['768w']} 768w, ${sources.jpeg['1080w']} 1080w`
    : getSrcset(src);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full bg-stone-100 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Blurhash Placeholder Canvas */}
      {!isLoaded && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: isLoaded ? 0 : 1, filter: 'blur(4px)' }}
        />
      )}

      {/* Real Image with AVIF/WebP Picture Support */}
      {isInViewport && (
        <picture className="contents">
          {avifSrcset && (
            <source
              type="image/avif"
              srcSet={avifSrcset}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          {webpSrcset && (
            <source
              type="image/webp"
              srcSet={webpSrcset}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          <img
            src={src}
            srcSet={jpegSrcset}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            loading="lazy"
            decoding="async"
            {...props}
          />
        </picture>
      )}
    </div>
  );
};
export default ProgressiveImage;
