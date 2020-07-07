const csso = require("csso");
const fs = require("fs");
const path = require("path");
const pug = require("pug");
const sjcl = require("sjcl");
const terser = require("terser");

// New Tab CSS
const newTabCSSContent = fs.readFileSync(
  path.resolve(__dirname, "../src/new-tab/index.css"),
  "utf-8",
);
const minifiedNewTabCSSContent = csso.minify(newTabCSSContent).css;

// New Tab JS
const newTabJSContent = fs.readFileSync(
  path.resolve(__dirname, "../src/new-tab/index.js"),
  "utf-8",
);
const minifiedNewTabJSContent = terser.minify(newTabJSContent, {
  ecma: 2020,
}).code;
const minifiedNewTabJSContentHash = sjcl.codec.base64.fromBits(
  sjcl.hash.sha256.hash(minifiedNewTabJSContent),
);

// Generate new-tab HTML
const mainHTML = pug.renderFile(
  path.resolve(__dirname, "../src/new-tab/index.pug"),
  {
    cssInline: minifiedNewTabCSSContent,
    jsInline: minifiedNewTabJSContent,
  },
);
fs.writeFileSync(
  path.resolve(__dirname, "../build/index.html"),
  mainHTML,
  "utf-8",
);

// Update manifest.json
const extensionManifest = require("../build/manifest.json");
extensionManifest.content_security_policy = `script-src 'self' 'unsafe-eval' 'sha256-${minifiedNewTabJSContentHash}'; object-src 'self'`;
fs.writeFileSync(
  path.resolve(__dirname, "../build/manifest.json"),
  JSON.stringify(extensionManifest),
  "utf-8",
);
