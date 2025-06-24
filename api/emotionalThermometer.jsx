import { endpoints } from './config';

export const getEmotionalThermometer = async (user_id, token) => {
  const cacheKey = `emotional-thermometer-${user_id}`;

  try {
    // Check cache first
    const cachedResponse = await caches.match(cacheKey);
    
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      if (!cachedData.needsRefresh) {
        console.log("Fetching data from cache");
        return {
          status: 'success',
          data: cachedData.thermometer,
          source: 'cache'
        };
      }
    }

    // If not in cache, fetch from API
    const url = `${endpoints.thermometer}?user_id=${encodeURIComponent(user_id)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': token,
        'Accept': 'application/json',
      },
    });

    const data = await response.json(); 
    console.log("Fetching data from api");

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch account settings');
    }

    const thermometerData = {
      current: data.current || null,
      analytics: {
        weekly_summary: data.analytics?.weekly_summary || {
          this_week: {
            positive: 0,
            negative: 0,
            neutral: 0,
            intense: 0
          }
        },
        mood_type_count: data.analytics?.mood_type_count || {
          positive: 0,
          negative: 0,
          neutral: 0,
          intense: 0
        },
        peak_hours: data.analytics?.peak_hours || {
          positive: null,
          negative: null
        },
        intensity_trend: data.analytics?.intensity_trend || [0],
        mood_distribution: data.analytics?.mood_distribution || {},
        average_intensity_by_category: data.analytics?.average_intensity_by_category || {
          positive: 0,
          negative: 0,
          neutral: 0,
          intense: 0
        },
        most_common_mood: data.analytics?.most_common_mood || "",
        most_intense_mood: data.analytics?.most_intense_mood || {
          mood: "",
          intensity: 0,
          timestamp: null
        },
        mood_streak_days: data.analytics?.mood_streak_days || 0
      }
    };

    // Store in cache
    await caches.open('thermometer-cache').then(cache => {
      cache.put(
        cacheKey,
        new Response(JSON.stringify({ thermometer: thermometerData }))
    )});

    return {
      status: 'success',
      data: thermometerData,
      source: 'api'
    };

  } catch (error) {
    console.error('Error fetching emotional thermometer data:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching emotional thermometer data.',
    };
  }
};