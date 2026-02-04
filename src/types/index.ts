// Enums as const objects for erasableSyntaxOnly compatibility
export const Role = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const VideoSource = {
  YOUTUBE: 'YOUTUBE',
  VIMEO: 'VIMEO',
  FACEBOOK: 'FACEBOOK',
  SOUNDCLOUD: 'SOUNDCLOUD',
  STREAMABLE: 'STREAMABLE',
  WISTIA: 'WISTIA',
  TWITCH: 'TWITCH',
  DAILYMOTION: 'DAILYMOTION',
  MIXCLOUD: 'MIXCLOUD',
  VIDYARD: 'VIDYARD',
  KALTURA: 'KALTURA',
  FILE: 'FILE',
} as const;
export type VideoSource = (typeof VideoSource)[keyof typeof VideoSource];

export const LayoutType = {
  FULLSCREEN: 'FULLSCREEN',
  SPLIT_HORIZONTAL: 'SPLIT_HORIZONTAL',
  SPLIT_VERTICAL: 'SPLIT_VERTICAL',
  PIP: 'PIP',
} as const;
export type LayoutType = (typeof LayoutType)[keyof typeof LayoutType];

// Models
export interface User {
  id: string;
  email: string | null;
  loginId: string | null;
  role: Role;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  userId: string;
  layoutId: string | null;
  sequenceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  url: string;
  title: string;
  duration: number | null;
  thumbnail: string | null;
  source: VideoSource;
  createdAt: string;
  updatedAt: string;
}

export interface Sequence {
  id: string;
  name: string;
  description: string | null;
  videoIds: string; // JSON array: ["id1", "id2", "id3"]
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  activeHours: string | null;
  createdAt: string;
  updatedAt: string;
  videos?: Video[]; // Populated by backend
}

export interface Layout {
  id: string;
  name: string;
  type: LayoutType;
  config: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface ClientConfig {
  client: Client;
  layout: Layout | null;
  sequence: Sequence | null;
}

// Playback queue item
export interface PlaybackItem {
  id: string;
  type: 'video';
  videoUrl: string;
  videoId: string;
}
