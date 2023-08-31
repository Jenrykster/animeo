const Anilist = require("anilist-node");
const { addonBuilder } = require("stremio-addon-sdk");
const { getNameFromKitsuId } = require("./lib/kitsu");
const { getNameFromCinemetaId } = require("./lib/cinemeta");
const { setUserToken, handleWatchedEpisode } = require("./lib/anilist");

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

builder.defineSubtitlesHandler(async (args) => {
  console.log(args.id);
  setUserToken(args.config.token);

  let animeName = "";
  let episode = 0;

  if (args.id.startsWith("kitsu")) {
    const [_, id, currEp] = args.id.split(":");
    animeName = await getNameFromKitsuId(id);
    episode = currEp;
  } else {
    let [id, season, currEp] = args.id.split(":");
    season = parseInt(season);

    animeName = await getNameFromCinemetaId(id, args.type);
    if (season > 1) {
      animeName += ` ${season}`;
    }
    episode = args.type === "movie" ? 1 : currEp;
  }

  console.log({
    animeName,
    episode,
  });
  if (animeName && episode) {
    await handleWatchedEpisode(animeName, parseInt(episode));
  }
  return Promise.resolve({ subtitles: [] });
});

module.exports = builder.getInterface();
