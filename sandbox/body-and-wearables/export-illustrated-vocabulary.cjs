"use strict";
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const source = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const match = source.match(/<script id="vocabulary-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match, "The original game's vocabulary-data source must exist.");
const { vocabulary } = JSON.parse(match[1]);
assert.equal(vocabulary.length, 73, "Preserve the original 73-concept dictionary.");
assert.equal(new Set(vocabulary.map(item => item.id)).size, 73);
assert.equal(vocabulary.filter(item => item.category === "body").length, 27);
const output = "// Generated from index.html by export-illustrated-vocabulary.cjs; do not edit by hand.\n" +
  "window.BodyWearablesVocabulary = " + JSON.stringify(vocabulary, null, 2) + ";\n";
fs.writeFileSync(path.join(__dirname, "illustrated-vocabulary.js"), output, "utf8");
console.log("Exported 73 authored vocabulary records for the illustrated demo.");
