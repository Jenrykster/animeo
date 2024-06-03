const axios = require('axios');
const LRU = require('lru-cache');
const { getFromDatabase } = require('./sqlite');
const { cacheToDatabase } = require('./sqlite');


memoryCache = new LRU({
  max: 10000
});

async function getAnilistId(id, source) {
  const cacheKey = `${source}:${id}`;

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const cachedId = await getFromDatabase(id, source);
  if (cachedId) {
    memoryCache.set(cacheKey, cachedId);
    return cachedId;
  }

  const anilistId = await fetchAnilistId(id, source);
  if (anilistId) {
    memoryCache.set(cacheKey, anilistId);
    await cacheToDatabase(anilistId, id, source);
  }

  return anilistId;
}

async function fetchAnilistId(id, source) {
  try {
    const response = await axios.get(
      `https://arm.haglund.dev/api/v2/ids?source=${source}&id=${id}&include=anilist`
    );
    const anilistId = response.data?.anilist;
    return anilistId;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  getAnilistId,
};
