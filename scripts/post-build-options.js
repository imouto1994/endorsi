const path = require("path");
const fs = require("fs");
const pug = require("pug");

const manifestJSON = require("../build/build-manifest.json");

// Options CSS
const optionsCSSURL = manifestJSON["options.css"];
const optionsCSSFilename = optionsCSSURL.split("/").pop();
const optionsCSSContent = fs.readFileSync(
  path.resolve(__dirname, `../build/${optionsCSSFilename}`),
  "utf-8",
);

// Options JS
const optionsJSURL = manifestJSON["options.js"];

// Generate options HTML
const optionsHTML = pug.renderFile(
  path.resolve(__dirname, "../src/options/index.pug"),
  {
    cssInline: { content: optionsCSSContent, url: optionsCSSURL },
    jsBundleURLs: [optionsJSURL],
  },
);
fs.writeFileSync(
  path.resolve(__dirname, "../build/options.html"),
  optionsHTML,
  "utf-8",
);
