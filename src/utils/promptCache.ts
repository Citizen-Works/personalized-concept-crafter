
// Cache for storing assembled base prompts
interface CachedPrompt {
  prompt: string;
  timestamp: number;
}

// Cache expiration time - 30 minutes
export const CACHE_EXPIRATION = 30 * 60 * 1000;

// In-memory cache for prompts
export const promptCache: Record<string, CachedPrompt> = {};

/**
 * Gets a cached prompt if it exists and is not expired
 */
export function getCachedPrompt(userId: string, contentType: string): string | null {
  const cacheKey = `${userId}_${contentType}`;
  const cachedPrompt = promptCache[cacheKey];
  
  if (cachedPrompt && Date.now() - cachedPrompt.timestamp < CACHE_EXPIRATION) {
    console.log('Using cached base prompt');
    return cachedPrompt.prompt;
  }
  
  return null;
}

/**
 * Stores a prompt in the cache
 */
export function cachePrompt(userId: string, contentType: string, prompt: string): void {
  const cacheKey = `${userId}_${contentType}`;
  promptCache[cacheKey] = {
    prompt,
    timestamp: Date.now()
  };
}

/**
 * Removes all cached prompts for a specific user
 */
export function invalidateUserCache(userId: string): void {
  const contentTypes = ['linkedin', 'newsletter', 'marketing'];
  contentTypes.forEach(type => {
    const cacheKey = `${userId}_${type}`;
    if (promptCache[cacheKey]) {
      delete promptCache[cacheKey];
      console.log(`Invalidated cache for ${cacheKey}`);
    }
  });
}
