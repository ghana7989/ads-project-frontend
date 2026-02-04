import type { PlaybackItem, Video } from '../types';

/**
 * Parse a sequence's videoIds to a playback queue
 * @param videoIds - JSON array string of video IDs: ["id1", "id2", "id3"]
 * @param videoMap - Map of video ID to Video object
 * @returns Array of playback items in order
 */
export function parseSequenceToPlaybackQueue(
  videoIds: string,
  videoMap: Map<string, Video>
): PlaybackItem[] {
  try {
    const ids: string[] = JSON.parse(videoIds);
    
    if (!ids || ids.length === 0) {
      console.warn('No video IDs found in sequence');
      return [];
    }

    // Map each video ID to a playback item
    const queue: PlaybackItem[] = ids
      .map((id) => {
        const video = videoMap.get(id);
        
        if (!video) {
          console.warn(`Video not found for ID: ${id}`);
          return null;
        }
        
        return {
          id,
          type: 'video' as const,
          videoUrl: video.url,
          videoId: id,
        };
      })
      .filter((item): item is PlaybackItem => item !== null);

    console.log(`Parsed ${queue.length} videos from sequence`);
    return queue;
  } catch (error) {
    console.error('Failed to parse sequence videoIds:', error);
    return [];
  }
}

/**
 * Check if current time is within active hours
 * @param activeHoursJson - JSON string: {"start":"09:00","end":"18:00"}
 * @returns true if within active hours or no restrictions
 */
export function isWithinActiveHours(activeHoursJson: string | null): boolean {
  if (!activeHoursJson) return true;

  try {
    const { start, end } = JSON.parse(activeHoursJson) as { start: string; end: string };
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime <= endTime;
  } catch {
    return true;
  }
}

/**
 * Check if current date is within start and end date range
 * @param startDate - ISO date string
 * @param endDate - ISO date string
 * @returns true if within date range or no restrictions
 */
export function isWithinDateRange(
  startDate: string | null,
  endDate: string | null
): boolean {
  const now = new Date();

  if (startDate && new Date(startDate) > now) {
    return false;
  }

  if (endDate && new Date(endDate) < now) {
    return false;
  }

  return true;
}
