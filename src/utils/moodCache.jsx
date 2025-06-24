const MOOD_CACHE_KEY = 'mood_expiry_cache';

export const getMoodCache = () => {
  try {
    const cache = localStorage.getItem(MOOD_CACHE_KEY);
    return cache ? JSON.parse(cache) : null;
  } catch (e) {
    return null;
  }
};

export const setMoodCache = (expiryTimestamp) => {
  try {
    localStorage.setItem(MOOD_CACHE_KEY, JSON.stringify({
      expires_at: expiryTimestamp,
      last_updated: Date.now()
    }));
  } catch (e) {
    console.error('Failed to set mood cache', e);
  }
};

export const clearMoodCache = () => {
  localStorage.removeItem(MOOD_CACHE_KEY);
};