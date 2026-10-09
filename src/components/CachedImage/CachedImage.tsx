"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CACHE_NAME = "playshelf-game-images-v1";
const MAX_CACHED_IMAGES = 150;

type CachedImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
};

export default function CachedImage({
  src,
  alt,
  fill = true,
  sizes = "180px",
}: CachedImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    setDisplaySrc(null);

    async function loadImage() {
      if (!src) return;

      try {
        if (!("caches" in window)) {
          if (active) setDisplaySrc(src);
          return;
        }

        const cache = await window.caches.open(CACHE_NAME);
        let response = await cache.match(src);

        if (!response) {
          response = await fetch(src, { mode: "cors" });

          if (!response.ok) {
            throw new Error(`Image request failed: ${response.status}`);
          }

          const contentType = response.headers.get("content-type") ?? "";

          if (!contentType.startsWith("image/")) {
            throw new Error("The response is not an image.");
          }

          // Caching can fail because of quota or browser restrictions.
          // The image can still be displayed if its response was fetched.
          try {
            await cache.put(src, response.clone());

            const keys = await cache.keys();

            if (keys.length > MAX_CACHED_IMAGES) {
              await cache.delete(keys[0]);
            }
          } catch (error) {
            console.warn("Could not cache game image:", error);
          }
        }

        const blob = await response.blob();

        if (!blob.type.startsWith("image/")) {
          throw new Error("The cached resource is not an image.");
        }

        objectUrl = URL.createObjectURL(blob);

        if (active) {
          setDisplaySrc(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        // Fallback: let the browser load the remote image normally.
        if (active) setDisplaySrc(src);
      }
    }

    void loadImage();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (!displaySrc) return null;

  return (
    <Image
      src={displaySrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      unoptimized
    />
  );
}