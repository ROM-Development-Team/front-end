import { endpoints } from './config';

export const getRantProfile = async (username, forceRefresh = false) => {
  const url = `${endpoints.rant}/profile?username=${encodeURIComponent(username)}`;
  const cacheKey = new Request(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  const cacheName = 'rant-profile-cache';

  try {
    const cache = await caches.open(cacheName);

    if (!forceRefresh) {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        console.log('Using cached rant profile');

        return {
          status: 'success',
          data: cachedData,
        };
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: 'error',
        message: errorData.message || 'Failed to fetch rant profile',
      };
    }

    const data = await response.json();

    const normalizedData = {
      user_id: data.profile.user_id || '',
      first_name: data.profile.first_name || '',
      last_name: data.profile.last_name || '',
      username: data.profile.username || '',
      profile: data.profile.profile || '',
    };

    const responseToCache = new Response(JSON.stringify(normalizedData), {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(cacheKey, responseToCache);

    console.log('Fetched and cached new rant profile');

    return {
      status: 'success',
      data: normalizedData,
    };

  } catch (error) {
    console.error('Error fetching rant profile:', error);
    return {
      status: 'error',
      message: 'An error occurred while fetching rant profile.',
    };
  }
};
