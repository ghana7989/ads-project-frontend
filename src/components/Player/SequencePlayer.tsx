import { Box, Typography, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import StartScreen from './StartScreen';
import { useSequencePlayer } from '../../hooks/useSequencePlayer';

export default function SequencePlayer() {
  const [userInteracted, setUserInteracted] = useState(false);
  const { currentItem, isPlaying, error, onVideoEnded, onVideoError } =
    useSequencePlayer();

  useEffect(() => {
    console.log('SequencePlayer state:', {
      userInteracted,
      isPlaying,
      hasCurrentItem: !!currentItem,
      currentItemUrl: currentItem?.videoUrl,
      error,
    });
  }, [userInteracted, isPlaying, currentItem, error]);

  const handleStart = () => {
    console.log('User clicked start');
    setUserInteracted(true);
  };

  // Show start screen if user hasn't interacted yet
  if (!userInteracted) {
    return <StartScreen onStart={handleStart} />;
  }

  if (error) {
    console.log('Showing error screen:', error);
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!isPlaying || !currentItem) {
    console.log('Showing loading screen - isPlaying:', isPlaying, 'currentItem:', currentItem);
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" color="white">
            Loading sequence...
          </Typography>
          <Typography variant="caption" color="white" sx={{ mt: 1, display: 'block' }}>
            {!isPlaying ? 'Waiting for playback to start...' : 'Waiting for video...'}
          </Typography>
        </Box>
      </Box>
    );
  }

  // All items are now videos
  if (currentItem.videoUrl) {
    console.log('Rendering VideoPlayer with URL:', currentItem.videoUrl);
    return (
      <VideoPlayer
        url={currentItem.videoUrl}
        playing={userInteracted}
        onEnded={onVideoEnded}
        onError={onVideoError}
      />
    );
  }

  console.log('No video URL found in current item');
  return null;
}
