const Kitsu = require("kitsu");

const kitsuApi = new Kitsu();

async function getNameFromKitsuId(id) {
  const kitsuEntry = await kitsuApi.fetch(`anime/${id}`);
  if (kitsuEntry) {
    return kitsuEntry.data.canonicalTitle;
  }
}

module.exports = {
  getNameFromKitsuId,
};
