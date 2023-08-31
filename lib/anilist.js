const Anilist = require("anilist-node");
let anilistApi = null;

function setUserToken(token) {
  if (token && !anilistApi) {
    anilistApi = new Anilist(token);
  }
}

async function handleWatchedEpisode(animeName, currentEpisode) {
  const anilistEntry = await getAnilistEntry(animeName);
  if (anilistEntry) {
    await updateAnilist(anilistEntry.id, currentEpisode);
  }
}

async function getAnilistEntry(name) {
  const response = await anilistApi.searchEntry.anime(name, null, 1, 1);
  const results = response.media;
  if (Array.isArray(results) && results.length > 0) {
    return results[0];
  }
}

async function updateAnilist(id, currentEpisode) {
  const currAnime = await anilistApi.media.anime(id);
  const currProgress = currAnime.mediaListEntry
    ? currAnime.mediaListEntry.progress
    : 0;
  if (currProgress >= currentEpisode) return;

  const updateResponse = await anilistApi.lists.addEntry(id, {
    progress: currentEpisode,
    status: currentEpisode === currAnime.episodes ? "COMPLETED" : "CURRENT",
  });

  console.log({
    hasUpdatedSuccessfully: !!updateResponse,
  });
}

module.exports = {
  setUserToken,
  handleWatchedEpisode,
};
