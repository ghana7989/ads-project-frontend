import ReactPlayer from 'react-player';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  playing: boolean;
  onEnded: () => void;
  onError: (error: string) => void;
}

// Type assertion for react-player props due to React 19 type incompatibility
const Player = ReactPlayer as React.ComponentType<{
  src: string; // v3 uses 'src' instead of 'url'
  playing?: boolean;
  controls?: boolean;
  light?: boolean;
  volume?: number;
  width?: string | number;
  height?: string | number;
  onReady?: () => void;
  onEnded?: () => void;
  onError?: (error: unknown) => void;
  onStart?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  style?: React.CSSProperties;
  config?: Record<string, unknown>;
  muted?: boolean;
}>;

export default function VideoPlayer({ url, playing, onEnded, onError }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Reset states when URL changes
    setIsReady(false);
    setHasStarted(false);
    setIsBuffering(false);
  }, [url, playing]);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsBuffering(false);
  };

  const handlePlay = () => {
    setHasStarted(true);
  };

  const handlePause = () => {
    // Pause event handler
  };

  const handleError = (e: unknown) => {
    console.error('Video playback error:', e);
    onError(String(e));
  };

  const handleEnded = () => {
    onEnded();
  };

  // Show loading only if video hasn't started yet (or is buffering before first start)
  const showLoading = !hasStarted || (isBuffering && !isReady);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
      }}
    >
      {showLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
            {!hasStarted ? 'Loading video...' : 'Buffering...'}
          </Typography>
        </Box>
      )}

      <Player
        src={url}
        playing={playing}
        controls={false}
        light={false}
        volume={0}
        muted={true}
        width="100%"
        height="100%"
        onReady={handleReady}
        onStart={handleStart}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              controls: 0,
              mute: 1,
            },
          },
        }}
      />
    </Box>
  );
}
