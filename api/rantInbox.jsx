import { endpoints } from "./config";

export const createRant = async (username, content, media = null) => {
  try {
    if (!username || !content) {
      throw new Error('Missing required parameters: username or content');
    }

    const payload = {
      username,
      content,
      media,
    };

    const response = await fetch(endpoints.rant, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create rant');
    }

    return {
      status: 'success',
      data: responseData,
    };
  } catch (error) {
    console.error('Error creating rant:', error.message);
    return {
      status: 'error',
      message: error.message || 'An error occurred while creating the rant',
    };
  }
};

export const getRantInbox = async (user_id, apiKey, page = 1, limit = 10, search = '', forceRefresh = false) => {
  const cacheKey = `rant-inbox-${user_id}`; 
  const cacheName = 'rant-cache';
  const onlineStatusKey = `rant-online-status-${user_id}`;

  try {
    const cache = await caches.open(cacheName);

    // If force refresh, load the data from api
    if (forceRefresh) {
      console.log('🔁 Force refresh requested - bypassing cache');

      const params = new URLSearchParams({
        user_id,
        page,
        limit,
        ...(search && { search })
      });

      const response = await fetch(`${endpoints.rant}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();

      const newCacheData = {
        data: responseData,
        isUpdate: false,
        timestamp: Date.now()
      };

      await cache.put(cacheKey, new Response(JSON.stringify(newCacheData)));

      return {
        status: 'success',
        data: responseData,
        source: 'api-force'
      };
    }

    
    let cachedResponse = await cache.match(cacheKey);
    let cachedData = cachedResponse ? await cachedResponse.json() : null;

    // Detect offline-to-online transition
    const wasOnline = localStorage.getItem(onlineStatusKey) === 'true';
    const isNowOnline = navigator.onLine;

    if (!wasOnline && isNowOnline && cachedData) {
      console.log('🔌 User was offline and is now online — set isUpdate = true');
      cachedData.isUpdate = true;
      await cache.put(cacheKey, new Response(JSON.stringify(cachedData)));
    }

    // Update the localStorage to reflect current state
    localStorage.setItem(onlineStatusKey, isNowOnline.toString());

    if (cachedData && cachedData.isUpdate !== true) {
      console.log("✅ Returning cached data (no updates pending)");
      return {
        status: 'success',
        data: cachedData.data,
        source: 'cache'
      };
    }

    console.log("🔁 Update flag detected - fetching fresh data");

    // ---- FETCH FRESH DATA FROM API ----
    const params = new URLSearchParams({
      user_id,
      page,
      limit,
      ...(search && { search })
    });

    const response = await fetch(`${endpoints.rant}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();

    // Prepare the cache data structure
    const newCacheData = {
      data: responseData, 
      isUpdate: false, 
      timestamp: Date.now() 
    };

    await cache.put(cacheKey, new Response(JSON.stringify(newCacheData)));

    console.log("🌐 Fetched fresh data from API");
    return {
      status: 'success',
      data: responseData,
      source: 'api'
    };

  } catch (error) {
    console.error('❌ Error fetching rant inbox:', error);

    // Fallback to cache if available (even if stale)
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(cacheKey);
      
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        console.warn("⚠️ Using cached data as fallback due to API error");
        return {
          status: 'success',
          data: cachedData.data,
          source: 'cache-fallback'
        };
      }
    } catch (cacheError) {
      console.error('Cache fallback failed:', cacheError);
    }

    return {
      status: 'error',
      message: error.message || 'Failed to fetch rant inbox',
      error: error
    };
  }
};

export const updateRantInbox = async (rant_id, user_id, apiKey) => {
  const cacheKey = `rant-inbox-${user_id}`;
  const cacheName = 'rant-cache';

  // Try updating the cache immediately (offline/online)
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();

      // Update read status in matching rant
      const updatedRants = cachedData.data?.rants?.map((rant) =>
        rant.rant_id === rant_id ? { ...rant, read: true } : rant
      );

      const updatedCacheData = {
        ...cachedData,
        data: {
          ...cachedData.data,
          rants: updatedRants,
        },
      };

      // Save back to cache
      await cache.put(cacheKey, new Response(JSON.stringify(updatedCacheData)));
      console.log("📝 Updated local cache: rant marked as read");
    }
  } catch (cacheError) {
    console.warn("⚠️ Failed to update rant cache locally:", cacheError);
  }

  // Try sending update to backend (only if online)
  try {
    if (!rant_id || !user_id || !apiKey) {
      throw new Error('Missing required parameters: rant_id, user_id, or API key');
    }

    const response = await fetch(endpoints.rant, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ rant_id, user_id }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to mark rant as read on server');
    }

    return {
      status: 'success',
      data: responseData,
    };
  } catch (error) {
    console.error('🌐 Backend error (offline or failed):', error.message);
    return {
      status: 'offline-sync',
      message: 'Marked locally, will retry sync when online',
    };
  }
};

export const deleteRantInbox = async (rant_id, user_id, apiKey) => {
  try {
    if (!rant_id || !user_id || !apiKey) {
      throw new Error('Missing required parameters: rant_id, user_id, or API key');
    }

    if (!navigator.onLine) {
      throw new Error('You are offline. Deleting rants requires an internet connection.');
    }

    const response = await fetch(endpoints.rant, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        rant_id,
        user_id,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to delete rant');
    }

    // 🧹 Clear cache and flag inbox for update
    const cacheName = 'rant-cache';
    const cacheKey = `rant-inbox-${user_id}`;

    const cache = await caches.open(cacheName);

    // Delete the inbox cache
    await cache.delete(cacheKey);

    // Set isUpdate = true via separate meta cache
    await cache.put(
      cacheKey,
      new Response(JSON.stringify({ isUpdate: true, updatedAt: Date.now() }))
    );

    return {
      status: 'success',
      data: responseData,
    };
  } catch (error) {
    console.error('Error deleting rant:', error.message);
    return {
      status: 'error',
      message: error.message || 'An error occurred while deleting the rant',
    };
  }
};