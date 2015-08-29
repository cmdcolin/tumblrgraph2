#!/bin/bash
rm -rf dist
mkdir -p dist/js
mkdir -p dist/css
mkdir -p dist/img
browserify js/index.js > dist/js/index.js
cp index.html dist/index.html
cp css/style.css dist/css/style.css
cp js/springy.js dist/js/springy.js
cp js/seedrandom.js dist/js/seedrandom.js
cp index.html dist
