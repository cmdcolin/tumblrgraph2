#!/bin/bash
set e
set u

rm -rf dist
mkdir -p dist/js
mkdir -p dist/img
browserify index.js | uglifyjs > dist/index.js
cp index.html dist/index.html
cp js/*.js dist/js/
cp index.html dist
