'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PlyrPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
}

const isYouTubeUrl = (url: string) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(url);

const isM3U8 = (url: string) => url.endsWith('.m3u8');

const PlyrPlayer: React.FC<PlyrPlayerProps> = ({
  videoUrl,
  posterUrl,
  title = 'Video Player',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [hasError, setHasError] = useState(false);
  const [isPlyrLoaded, setIsPlyrLoaded] = useState(false);

  useEffect(() => {
    const loadPlayer = async () => {
      if (isYouTubeUrl(videoUrl)) return;

      try {
        const Plyr = (await import('plyr')).default;
        setIsPlyrLoaded(true);

        if (videoRef.current && !playerRef.current) {
          playerRef.current = new Plyr(videoRef.current, {
            controls: [
              'play',
              'progress',
              'current-time',
              'duration',
              'mute',
              'volume',
              'settings',
              'fullscreen',
            ],
            settings: ['quality', 'speed'],
            quality: {
              default: 720,
              options: [1080, 720, 480],
            },
            tooltips: { controls: true, seek: true },
            autoplay: false,
            captions: { active: true, language: 'auto', update: true },
          });

          playerRef.current.on('error', (event: any) => {
            console.error('Plyr error:', event);
            setHasError(true);
          });
        }
      } catch (err) {
        console.error('Failed to load Plyr:', err);
        setHasError(true);
      }
    };

    loadPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoUrl]);

  if (hasError) {
    return (
      <div className="bg-red-900/50 border border-red-500/50 text-white p-6 rounded-lg text-center">
        <p className="font-semibold text-lg mb-2">Error loading video</p>
        <p className="text-sm text-red-200">Please try again later or check the video source.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl bg-black aspect-video">
      {isYouTubeUrl(videoUrl) ? (
        <iframe
          src={videoUrl.replace('watch?v=', 'embed/')}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <video
          ref={videoRef}
          playsInline
          controls={!isPlyrLoaded}
          poster={posterUrl || 'https://placehold.co/1280x720/2D3748/EDF2F7?text=Loading+Video'}
          crossOrigin="anonymous"
          title={title}
          className="w-full h-full"
        >
          <source src={videoUrl} type={isM3U8(videoUrl) ? 'application/x-mpegURL' : 'video/mp4'} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default PlyrPlayer;
