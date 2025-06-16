import { endpoints } from './config';

export const getAccountSettings = async (user_id, token, forceRefresh = false) => {
  const url = `${endpoints.account}?user_id=${encodeURIComponent(user_id)}`;

  const cacheKey = new Request(url, {
    headers: {
      'x-api-key': token,
      'Accept': 'application/json',
    },
  });

  const cacheName = 'account-settings-cache';

  try {
    const cache = await caches.open(cacheName);

    // Try to use cache first if not forceRefresh
    if (!forceRefresh) {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        console.log('Using cached account settings');

        return {
          status: 'success',
          data: cachedData,
        };
      }
    }

    // Otherwise fetch from the network
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': token,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: 'error',
        message: errorData.message || 'Failed to fetch account settings',
      };
    }

    const data = await response.json();

    const normalizedData = {
      profile: data.profile || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      username: data.username || '',
      rant_link: data.rant_link || '',
      email: data.email || '',
      bio: data.bio || '',
      mood: data.mood || '',
      mood_note: data.mood_note || '',
    };

    // Save fresh data to cache
    const responseToCache = new Response(JSON.stringify(normalizedData), {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(cacheKey, responseToCache);

    console.log('Fetched and cached new account settings');

    return {
      status: 'success',
      data: normalizedData,
    };

  } catch (error) {
    console.error('Error fetching account settings:', error);
    return {
      status: 'error',
      message: 'An error occurred while fetching account settings.',
    };
  }
};

export const updateAccountSettings = async (user_id, token, updates = {}) => {
  const url = `${endpoints.account}?user_id=${encodeURIComponent(user_id)}`;

  try {
    const response = await fetch(url, {
      method: 'PUT', 
      headers: {
        'x-api-key': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to update account settings',
      };
    }

    // Clear cache so fresh data is fetched next time
    const cacheName = 'account-settings-cache';
    const cacheKey = new Request(url, {
      headers: {
        'x-api-key': token,
        'Accept': 'application/json',
      },
    });

    const cache = await caches.open(cacheName);
    await cache.delete(cacheKey);

    return {
      status: 'success',
      message: data.message || 'Account settings updated successfully.',
    };

  } catch (error) {
    console.error('Error updating account settings:', error);
    return {
      status: 'error',
      message: 'An error occurred while updating account settings.',
    };
  }
};
