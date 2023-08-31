const axios = require("axios");

async function getNameFromCinemetaId(id, type) {
  const response = await axios.get(
    `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`
  );
  if (response.data) {
    return response.data.meta.name;
  }
}

module.exports = {
  getNameFromCinemetaId,
};
