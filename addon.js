const { addonBuilder } = require("stremio-addon-sdk");
const { getNameFromKitsuId } = require("./lib/kitsu");
const { getNameFromCinemetaId } = require("./lib/cinemeta");
const { getCatalog } = require("./lib/anilist");
const { setUserToken, handleWatchedEpisode } = require("./lib/anilist");

const CATALOGS = [
  {
    id: "CURRENT",
    type: "anime",
    name: "Currently watching",
  },
  {
    id: "REPEATING",
    type: "anime",
    name: "Repeating",
  },
  {
    id: "PLANNING",
    type: "anime",
    name: "Planning to watch",
  },
  {
    id: "COMPLETED",
    type: "anime",
    name: "Completed",
  },
  {
    id: "PAUSED",
    type: "anime",
    name: "Paused",
  },
];

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const builder = new addonBuilder({
  id: "com.jenryk.animeo",
  version: "0.0.2",
  catalogs: CATALOGS,
  logo: "https://i.imgur.com/tLsz4at.png",
  resources: ["subtitles"],
  types: ["movie", "series"],
  idPrefixes: ["anilist", "tt", "kitsu"],
  name: "animeo",
  description: "Track your anime progress with anilist while using stremio.",
  behaviorHints: {
    configurable: true,
    configurationRequired: true,
  },
  config: [
    {
      key: "token",
      type: "text",
      title: "Anilist token",
    },
  ],
});

builder.defineSubtitlesHandler(async (args) => {
  const { token } = args.config;
  let animeName = "";
  let episode = "0";

  if (args.id.startsWith("kitsu")) {
    const [_, id, currEp] = args.id.split(":");
    animeName = await getNameFromKitsuId(id);
    episode = currEp;
  } else {
    let [id, seasonName, currEp] = args.id.split(":");
    const season = parseInt(seasonName);

    animeName = await getNameFromCinemetaId(id, args.type);
    if (season > 1) {
      animeName += ` ${season}`;
    }
    episode = args.type === "movie" ? "1" : currEp;
  }

  if (animeName && episode) {
    await handleWatchedEpisode(animeName, parseInt(episode), token);
  }
  return Promise.resolve({ subtitles: [] });
});

builder.defineCatalogHandler(async (args) => {
  const { token } = args.config;
  let metas = [];
  const anilistListType = CATALOGS.find((catalog) => catalog.id === args.id);
  if (anilistListType) {
    try {
      metas = await getCatalog(anilistListType.id, token);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    metas,
  };
});

module.exports = builder.getInterface();
