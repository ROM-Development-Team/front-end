import { endpoints } from './config';

export const createPost = async (postData, userId, token) => {
  try {
    // Validate required fields
    if (!token || !userId) {
      throw new Error('Missing API key or user_id');
    }

    // Destructure with defaults for optional fields
    const {
      user_id,
      topic,
      prompt = null,
      description,
      mood,
      privacy = 'public',
      background_style = 'default'
    } = postData;

    // Validate required post fields
    if (!topic || !description) {
      throw new Error('Topic and description are required fields');
    }

    if (!mood) {
      throw new Error('Mood is required');
    }

    // Prepare payload with timestamps
    const payload = {
      user_id,
      topic,
      prompt,
      description,
      mood,
      privacy,
      background_style,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const response = await fetch(endpoints.posts, {
    // const response = await fetch("http://localhost:5000/api/v1/posts", {
      method: 'POST',
      headers: {
        'x-api-key': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create post');
    }

    const cacheKey = `posts-${userId}-1-10`; 
    const cacheName = 'posts-cache';
    
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(cacheKey);
      
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        // Update the cached data with refresh flag
        await cache.put(
          cacheKey,
          new Response(JSON.stringify({
            ...cachedData,
            isRefresh: true
          }))
        );
        console.log('Updated cache with refresh flag after post creation');
      }
    } catch (cacheError) {
      console.error('Error updating cache with refresh flag:', cacheError);
    }

    return {
      status: 'success',
      message: 'Post created successfully',
      post_id: responseData.post_id, // Include the post ID from response
      post: responseData.post // Include the full post data if available
    };

  } catch (error) {
    console.error('Error creating post:', error.message);
    return {
      status: 'error',
      message: error.message || 'An error occurred while creating the post',
      error: error // Include full error object for debugging
    };
  }
};

export const getPosts = async (user_id, token, page = 1, limit = 10, forceRefresh = false) => {
  const cacheKey = `posts-${user_id}-${page}-${limit}`;
  const cacheName = 'posts-cache';

  try {
    // Open cache
    const cache = await caches.open(cacheName);
    
    // Check if we have cached data
    const cachedResponse = await cache.match(cacheKey);
    let cachedData = null;
    
    if (cachedResponse) {
      cachedData = await cachedResponse.json();
      
      // Check if this is a window reload by looking for isRefresh flag
      const isWindowReload = cachedData?.isRefresh || forceRefresh;
      
      // If not a reload and not forcing refresh, return cached data
      if (!isWindowReload && !forceRefresh) {
        console.log("Fetching posts from cache");
        return {
          status: 'success',
          data: cachedData.posts,
          pagination: cachedData.pagination,
          source: 'cache'
        };
      }
      
      // If this is a refresh, clear ALL post caches for this user
      if (isWindowReload) {
        console.log("Clearing all post caches due to refresh");
        const cacheKeys = await cache.keys();
        const postCacheKeys = cacheKeys.filter(request => 
          request.url.includes(`posts-${user_id}`)
        );
        
        await Promise.all(postCacheKeys.map(request => cache.delete(request)));
      }
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (user_id) params.append('user_id', user_id);

    const url = `${endpoints.posts}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': token,
        'Accept': 'application/json',
      },
    });

    const responseData = await response.json();
    console.log("Fetching posts from api");

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch posts');
    }

    // Prepare fresh data
    const postsData = {
      posts: responseData.data || [],
      pagination: {
        current_page: responseData.pagination?.current_page || page,
        limit: responseData.pagination?.limit || limit,
        total_count: responseData.pagination?.total_count || 0,
        total_pages: responseData.pagination?.total_pages || 1,
        has_next: responseData.pagination?.has_next || false,
        has_prev: responseData.pagination?.has_prev || false
      }
    };

    // Store fresh data in cache (without isRefresh flag)
    await cache.put(
      cacheKey,
      new Response(JSON.stringify(postsData))
    );
    console.log("Stored fresh data in cache after refresh");

    return {
      status: 'success',
      data: postsData.posts,
      pagination: postsData.pagination,
      source: 'api'
    };

  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching posts.',
    };
  }
};