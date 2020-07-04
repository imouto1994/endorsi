const path = require("path");
const fs = require("fs");
const pug = require("pug");

const manifestJSON = require("../build/build-manifest.json");

// CSS
const mainCSSURL = manifestJSON["main.css"];
const mainCSSFilename = mainCSSURL.split("/").pop();
const mainCSSContent = fs.readFileSync(
  path.resolve(__dirname, `../build/${mainCSSFilename}`),
  "utf-8",
);

const optionsCSSURL = manifestJSON["options.css"];
const optionsCSSFilename = optionsCSSURL.split("/").pop();
const optionsCSSContent = fs.readFileSync(
  path.resolve(__dirname, `../build/${optionsCSSFilename}`),
  "utf-8",
);

// JS
const mainJSURL = manifestJSON["main.js"];
const optionsJSURL = manifestJSON["options.js"];

(function () {
  // Generate main HTML
  const mainHTML = pug.renderFile(
    path.resolve(__dirname, "../src/template.pug"),
    {
      cssInline: { content: mainCSSContent, url: mainCSSURL },
      jsBundleURLs: [mainJSURL],
    },
  );
  fs.writeFileSync(
    path.resolve(__dirname, "../build/index.html"),
    mainHTML,
    "utf-8",
  );

  // Generate options HTML
  const optionsHTML = pug.renderFile(
    path.resolve(__dirname, "../src/template.pug"),
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
})();
