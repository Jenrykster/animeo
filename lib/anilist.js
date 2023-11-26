const Anilist = require("anilist-node");
let anilistApi = null;

function setUserToken(token) {
  if (token) {
    anilistApi = new Anilist(token);
  } else {
    anilistApi = null;
  }
}

async function getCatalog(catalogType) {
  try {
    const currentUser = await anilistApi.user.getAuthorized();
    const userLists = await anilistApi.lists.anime(currentUser.id);

    const list = userLists.find((item) => item.status === catalogType);

    if (!list) return [];

    return list.entries.map(({ media }) => ({
      id: "anilist:" + media.id,
      type: media.format === "MOVIE" ? "movie" : "series",
      name: media.title.userPreferred,
      poster: media.coverImage.medium,
      description: media.description,
      genres: media.gennres,
      imdbRating: media.score,
    }));
  } catch (err) {
    anilistApi = null;
    throw err;
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
  if (currProgress >= currentEpisode || currentEpisode > currAnime.episodes)
    return;

  await anilistApi.lists.addEntry(id, {
    progress: currentEpisode,
    status: currentEpisode === currAnime.episodes ? "COMPLETED" : "CURRENT",
  });
}

module.exports = {
  setUserToken,
  handleWatchedEpisode,
  getCatalog,
};
