const axios = require('axios');

async function getAnilistIdFromKitsuId(kitsuId, source) {
  try {
    const response = await axios.get(
      `https://relations.yuna.moe/api/ids?source=${source}&id=${kitsuId}`,
    );
    const anilistId = response.data?.anilist;
    return anilistId || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  getAnilistIdFromKitsuId,
};
