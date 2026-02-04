import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PlaybackItem, Sequence } from '../../types';

interface PlayerState {
  sequence: Sequence | null;
  playbackQueue: PlaybackItem[];
  currentIndex: number;
  isPlaying: boolean;
  currentVideoUrl: string | null;
  error: string | null;
}

const initialState: PlayerState = {
  sequence: null,
  playbackQueue: [],
  currentIndex: 0,
  isPlaying: false,
  currentVideoUrl: null,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setSequence: (state, action: PayloadAction<Sequence | null>) => {
      state.sequence = action.payload;
    },
    setPlaybackQueue: (state, action: PayloadAction<PlaybackItem[]>) => {
      state.playbackQueue = action.payload;
      state.currentIndex = 0;
    },
    nextItem: (state) => {
      if (state.currentIndex < state.playbackQueue.length - 1) {
        state.currentIndex += 1;
      } else {
        // Loop back to start
        state.currentIndex = 0;
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentVideoUrl: (state, action: PayloadAction<string | null>) => {
      state.currentVideoUrl = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetPlayer: (state) => {
      state.playbackQueue = [];
      state.currentIndex = 0;
      state.isPlaying = false;
      state.currentVideoUrl = null;
      state.error = null;
    },
  },
});

export const {
  setSequence,
  setPlaybackQueue,
  nextItem,
  setCurrentIndex,
  setIsPlaying,
  setCurrentVideoUrl,
  setError,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
