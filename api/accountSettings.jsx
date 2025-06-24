import { endpoints } from './config';

export const getAccountSettings = async (user_id, token) => {
  const cacheKey = `account-settings-${user_id}`;

  try {
    // Check cache first
    const cachedResponse = await caches.match(cacheKey);
    
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      console.log("Fetching data from cache");
      return {
        status: 'success',
        data: cachedData.settings,
        source: 'cache'
      };
    }

    // If not in cache, fetch from API
    const url = `${endpoints.account}?user_id=${encodeURIComponent(user_id)}`;
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

    const settingsData = {
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

    // Store in cache
    await caches.open('account-cache').then(cache => {
      cache.put(
        cacheKey,
        new Response(JSON.stringify({ settings: settingsData }))
    )});

    return {
      status: 'success',
      data: settingsData,
      source: 'api'
    };

  } catch (error) {
    console.error('Error fetching account settings:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching account settings.',
    };
  }
};

export const updateAccountSettings = async (user_id, token, updates = {}) => {
  const accountCacheKey = `account-settings-${user_id}`;
  const thermometerCacheKey = `emotional-thermometer-${user_id}`;
  const url = `${endpoints.account}?user_id=${encodeURIComponent(user_id)}`;

  try {
    // 1. Make API request
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
    if (!response.ok) throw new Error(data.message || 'Update failed');

    // 2. Update existing cache (using same cache as getAccountSettings)
    const cache = await caches.open('account-cache'); // Match getAccountSettings cache name
    const cachedResponse = await cache.match(accountCacheKey);
    
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      await cache.put(
        accountCacheKey,
        new Response(JSON.stringify({
          settings: {
            ...cachedData.settings, // Existing cached data
            ...updates              // New updates
          }
        }))
      );
    }

    try {
      const thermometerCache = await caches.open('thermometer-cache');
      await thermometerCache.delete(thermometerCacheKey);
      console.log('Cleared emotional thermometer cache');

      await thermometerCache.put(
        thermometerCacheKey,
        new Response(JSON.stringify({
          needsRefresh: true,
          lastUpdated: new Date().toISOString()
        }))
      );
    } catch (cacheError) {
      console.error('Error clearing thermometer cache:', cacheError);
    }

    return {
      status: 'success',
      message: 'Profile data successfully updated!',
      data: { ...data, ...updates } // Return combined data
    };

  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Update failed'
    };
  }
};

export const discoverContent = async (token, params = {}) => {
  const { userId, search, page = 1, limit = 5 } = params;
  const cacheKey = `discover-${userId}-${search}-${page}-${limit}`;

  const DISCOVER_CACHE_NAME = 'discover-cache';
  const RESET_INTERVAL = 1 * 60 * 60 * 1000;
  const LAST_RESET_KEY = 'lastDiscoverCacheReset';

  try {
    // Check and reset discover cache every 6 hours
    const now = Date.now();
    const lastReset = parseInt(localStorage.getItem(LAST_RESET_KEY), 10) || 0;

    if (now - lastReset > RESET_INTERVAL) {
      console.log("Clearing discover cache (older than 6 hours)");
      const cache = await caches.open(DISCOVER_CACHE_NAME);
      const keys = await cache.keys();
      for (const request of keys) {
        if (request.url.includes('/discover')) {
          await cache.delete(request);
        }
      }
      localStorage.setItem(LAST_RESET_KEY, now.toString());
    }

    // Skip cache check if there's a search query
    if (search) {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('user_id', userId);
      if (search) queryParams.append('search', search);
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      const url = `${endpoints.account}/discover?${queryParams.toString()}`;

      // Fetch from API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': token,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Fetching discover data from API");

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch discover content');
      }

      return {
        status: 'success',
        data: data.data,
        source: 'api'
      };
    }

    // For non-search requests, check cache first
    const cachedResponse = await caches.match(cacheKey);
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      console.log("Fetching discover data from cache");
      return {
        status: 'success',
        data: cachedData,
        source: 'cache'
      };
    }

    // Build query parameters for non-search requests
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('user_id', userId);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const url = `${endpoints.account}/discover?${queryParams.toString()}`;

    // Fetch from API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': token,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log("Fetching discover data from API");

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch discover content');
    }

    // Store in cache (only if successful and not a search request)
    if (data.status === "success") {
      const cache = await caches.open(DISCOVER_CACHE_NAME);
      cache.put(cacheKey, new Response(JSON.stringify(data.data)));
    }

    return {
      status: 'success',
      data: data.data,
      source: 'api'
    };

  } catch (error) {
    console.error('Error fetching discover content:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching discover content.',
    };
  }
};