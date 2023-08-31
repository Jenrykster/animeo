#!/usr/bin/env node
const path = require("path");

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

serveHTTP(addonInterface, {
  port: process.env.PORT || 55985,
  customConfigPage: path.join(__dirname, "static", "config.html"),
});
// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
