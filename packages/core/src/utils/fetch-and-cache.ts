export const CACHE = new Map();
export const CACHE_NAME = 'EXTERNAL_FETCHES';
export const newRequest = async (cache: Cache, request: RequestInfo, fetchOpts?: RequestInit) => {
  let networkResponse: Response = await fetch(request, fetchOpts);

  let clonedResponse = networkResponse.clone();
  if ("caches" in globalThis)
    cache.put(request, clonedResponse);
  else
    CACHE.set(request, clonedResponse);

  return networkResponse;
};

export let OPEN_CACHE: Cache;
export const openCache = async () => {
  if (OPEN_CACHE) return OPEN_CACHE;
  return (OPEN_CACHE = await caches.open(CACHE_NAME))
}

export const getRequest = async (url: RequestInfo | URL, permanent: boolean = false, fetchOpts?: RequestInit) => {
  let request = 'Request' in globalThis ? new Request(url.toString()) : url.toString();
  let response: Response;

  let cache: Cache;
  let cacheResponse: Response;

  // In specific situations the browser will sometimes disable access to cache storage, 
  // so, I create my own in memory cache
  if ("caches" in globalThis) {
    cache = await openCache();
    cacheResponse = await cache.match(request);
  } else {
    cacheResponse = CACHE.get(request);
  }

  response = cacheResponse;

  // If permanent is true, use the cache first and only go to the network if there is nothing in the cache, 
  // otherwise, still use cache first, but in the background queue up a network request
  if (!cacheResponse)
    response = await newRequest(cache, request, fetchOpts);
  else if (!permanent)
    newRequest(cache, request, fetchOpts);

  return response.clone();
}
