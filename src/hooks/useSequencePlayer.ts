import { useEffect, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  setPlaybackQueue,
  nextItem,
  setIsPlaying,
  setCurrentVideoUrl,
  setError,
} from '../features/player/playerSlice';
import { useGetSequenceQuery, useHeartbeatMutation } from '../app/api/clientApi';
import {
  parseSequenceToPlaybackQueue,
  isWithinActiveHours,
  isWithinDateRange,
} from '../utils/sequenceParser';
import type { PlaybackItem } from '../types';

interface UseSequencePlayerReturn {
  currentItem: PlaybackItem | null;
  isPlaying: boolean;
  error: string | null;
  onVideoEnded: () => void;
  onVideoError: (error: string) => void;
}

export function useSequencePlayer(): UseSequencePlayerReturn {
  const dispatch = useAppDispatch();
  const { playbackQueue, currentIndex, isPlaying, error } = useAppSelector(
    (state) => state.player
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: sequence, isLoading, refetch } = useGetSequenceQuery(undefined, {
    skip: !isAuthenticated,
    // Removed polling interval - updates will be pushed via WebSocket
  });
  const [sendHeartbeat] = useHeartbeatMutation();
  const heartbeatIntervalRef = useRef<number | null>(null);

  // Parse sequence into playback queue
  useEffect(() => {
    if (!sequence || isLoading) return;

    console.log('Processing sequence:', sequence);

    // Check if sequence is active
    if (!sequence.isActive) {
      dispatch(setError('Sequence is not active'));
      return;
    }

    // Check date range
    if (!isWithinDateRange(sequence.startDate, sequence.endDate)) {
      dispatch(setError('Sequence is not within scheduled dates'));
      return;
    }

    // Check active hours
    if (!isWithinActiveHours(sequence.activeHours)) {
      dispatch(setError('Sequence is not within active hours'));
      return;
    }

    // Build video map from sequence.videos (populated by backend)
    const videoMap = new Map();
    if (sequence.videos && Array.isArray(sequence.videos)) {
      sequence.videos.forEach((video: any) => {
        videoMap.set(video.id, video);
        console.log(`Mapped video ${video.id} -> ${video.url}`);
      });
    }

    console.log('Built video map with', videoMap.size, 'videos');

    const queue = parseSequenceToPlaybackQueue(sequence.videoIds, videoMap);
    if (queue.length === 0) {
      dispatch(setError('No playable items in sequence'));
      return;
    }

    console.log('Playback queue:', queue);

    dispatch(setPlaybackQueue(queue));
    dispatch(setIsPlaying(true));
    dispatch(setError(null));
  }, [sequence, isLoading, dispatch]);

  // Handle current item changes
  useEffect(() => {
    if (playbackQueue.length === 0) return;

    const currentItem = playbackQueue[currentIndex];
    if (!currentItem) return;

    // All items are now videos - just set the current video URL
    if (currentItem.videoUrl) {
      dispatch(setCurrentVideoUrl(currentItem.videoUrl));
    }
  }, [playbackQueue, currentIndex, dispatch]);

  // Send heartbeat periodically (whenever authenticated, not just when playing)
  useEffect(() => {
    if (!isAuthenticated) return;

    const sendStatus = () => {
      const currentItem = playbackQueue[currentIndex];
      sendHeartbeat({
        status: isPlaying ? 'playing' : 'idle',
        currentVideoId: currentItem?.videoId,
      });
    };

    // Send initial heartbeat
    sendStatus();

    // Send heartbeat every 30 seconds
    heartbeatIntervalRef.current = window.setInterval(sendStatus, 30000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [isAuthenticated, isPlaying, playbackQueue, currentIndex, sendHeartbeat]);

  const onVideoEnded = useCallback(() => {
    dispatch(nextItem());
  }, [dispatch]);

  const onVideoError = useCallback(
    (errorMessage: string) => {
      console.error('Video error:', errorMessage);
      // Try next item on error
      dispatch(nextItem());
    },
    [dispatch]
  );

  const currentItem = playbackQueue[currentIndex] || null;

  return {
    currentItem,
    isPlaying,
    error,
    onVideoEnded,
    onVideoError,
  };
}
