"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { HeroVideoSource } from "@/lib/join-media";

interface HeroMediaProps {
  poster: string;
  sources: readonly HeroVideoSource[];
}

/**
 * The hero's media layer: the poster image always renders (it is the
 * no-JavaScript, reduced-motion, and slow-network state), and the looping
 * video mounts above it only after hydration when the visitor does not prefer
 * reduced motion and video files exist. The video stays invisible until it can
 * actually play, then cross-fades in — so a missing, slow, or failing video is
 * simply never seen rather than a broken box.
 */
export function HeroMedia({ poster, sources }: HeroMediaProps) {
  const [motionOk, setMotionOk] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (sources.length === 0) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [sources.length]);

  const showVideo = motionOk && sources.length > 0;

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={() => setVideoReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            videoReady ? "opacity-100" : "opacity-0",
          )}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : null}
    </div>
  );
}
