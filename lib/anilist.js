const Anilist = require("anilist-node");

async function getCatalog(catalogType, token) {
  const anilistApi = new Anilist(token);
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
}

async function handleWatchedEpisode(
  animeName,
  anilistId,
  currentEpisode,
  preAddedOnly,
  token
) {
  if (animeName) {
    const anilistEntry = await getAnilistEntry(animeName, token);
    if (anilistEntry) {
      await updateAnilist(anilistEntry.id, currentEpisode, preAddedOnly, token);
    }
  } else if (anilistId) {
    await updateAnilist(anilistId, currentEpisode, preAddedOnly, token);
  }
}

async function getAnilistEntry(name, token) {
  const anilistApi = new Anilist(token);
  const response = await anilistApi.searchEntry.anime(name, undefined, 1, 1);
  const results = response.media;
  if (Array.isArray(results) && results.length > 0) {
    return results[0];
  }
}

async function updateAnilist(id, currentEpisode, preAddedOnly, token) {
  const anilistApi = new Anilist(token);
  const currAnime = await anilistApi.media.anime(id);

  if (preAddedOnly && !currAnime.mediaListEntry) return;

  const currProgress = currAnime.mediaListEntry
    ? currAnime.mediaListEntry.progress
    : 0;
  if (
    currProgress >= currentEpisode ||
    (currAnime.episodes != null && currentEpisode > currAnime.episodes)
  )
    return;

  await anilistApi.lists.addEntry(id, {
    progress: currentEpisode,
    status: currentEpisode === currAnime.episodes ? "COMPLETED" : "CURRENT",
  });
}

module.exports = {
  handleWatchedEpisode,
  getCatalog
};
