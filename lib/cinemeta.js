const axios = require("axios");

async function getNameFromCinemetaId(id, type) {
  const response = await axios.get(
    `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`
  );

  if (response.data) {
    const { genre, genres, name } = response.data.meta;
    const isAnimation =
      genre?.includes("Animation") || genres?.includes("Animation");

    return isAnimation ? name : null;
  }
}

module.exports = {
  getNameFromCinemetaId,
};
