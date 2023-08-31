const Kitsu = require("kitsu");
const Anilist = require("anilist-node");
const { addonBuilder } = require("stremio-addon-sdk");

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const builder = new addonBuilder({
  id: "com.jenryk.animeo",
  version: "0.0.1",
  catalogs: [],
  resources: ["subtitles"],
  types: ["movie", "series"],
  idPrefixes: ["tt", "kitsu"],
  name: "Animeo",
  description: "Track your anime progress with anilist while using stremio.",
  behaviorHints: {
    configurable: true,
  },
  config: [
    {
      key: "token",
      type: "text",
      title: "Anilist token",
    },
  ],
});

const kitsuApi = new Kitsu();
let anilistApi = null;

builder.defineSubtitlesHandler(async (args) => {
  console.log(args.id);
  if (args.config.token && !anilistApi) {
    anilistApi = new Anilist(args.config.token);
  }

  if (args.id.startsWith("kitsu")) {
    const [_, id, episode] = args.id.split(":");

    const kitsuEntry = await kitsuApi.fetch(`anime/${id}`);

    if (kitsuEntry) {
      await handleWatchedEpisode(kitsuEntry.data.canonicalTitle, episode);
    }
  }

  return Promise.resolve({ subtitles: [] });
});

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
  const hasUpdatedSuccessfully = await anilistApi.lists.addEntry(id, {
    progress: parseInt(currentEpisode),
    status: "CURRENT",
  });

  console.log({
    hasUpdatedSuccessfully,
  });
}

module.exports = builder.getInterface();
