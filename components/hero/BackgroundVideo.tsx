'use client';

import React, { useEffect, useRef, useState } from 'react';

// Primary: Mux HLS stream
const HLS_SRC = 'https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8';

// Fallback: free, always-available open-licensed MP4 (Big Buck Bunny dark cinematic crop)
// This serves as a guaranteed offline-safe demo backdrop
const MP4_FALLBACK = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

interface BackgroundVideoProps {
  src?: string;
  fallback?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  src = HLS_SRC,
  fallback = MP4_FALLBACK,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;
    let hlsInstance: import('hls.js').default | null = null;

    const markReady = () => {
      if (!mounted) return;
      setReady(true);
      video.play().catch(() => {});
    };

    const loadFallback = () => {
      if (!mounted) return;
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
      video.src = fallback;
      video.load();
      video.addEventListener('canplay', markReady, { once: true });
    };

    const startHls = async () => {
      if (!mounted) return;

      // Safari / native HLS support
      if (!window.MediaSource && video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', markReady, { once: true });
        video.addEventListener('error', loadFallback, { once: true });
        return;
      }

      // Dynamically import hls.js so it never blocks the initial render
      try {
        const { default: Hls } = await import('hls.js');

        if (!Hls.isSupported()) {
          loadFallback();
          return;
        }

        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
          // Start loading immediately, do not wait
          startLevel: -1,
          autoStartLoad: true,
        });

        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          markReady();
        });

        hlsInstance.on(Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal) return;
          if (data.type === (Hls as any).ErrorTypes?.NETWORK_ERROR) {
            // Network error → try MP4 fallback
            loadFallback();
          } else if (data.type === (Hls as any).ErrorTypes?.MEDIA_ERROR) {
            hlsInstance?.recoverMediaError();
          } else {
            loadFallback();
          }
        });
      } catch {
        // hls.js import failed → use MP4 directly
        loadFallback();
      }
    };

    // Start immediately — do NOT defer with requestIdleCallback
    startHls();

    return () => {
      mounted = false;
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    };
  }, [src, fallback]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Immediate dark fallback — always visible behind the video */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 70% 60%, #071018 0%, #060c11 60%, #030608 100%)' }}
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 1200ms ease',
          willChange: 'opacity',
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};
