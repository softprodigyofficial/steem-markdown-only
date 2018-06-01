"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var imageRegex = exports.imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;

var dtubeImageRegex = exports.dtubeImageRegex = /<a href="https:\/\/d.tube.#!\/v\/[^/"]+\/[^/"]+"><img src="[^"]+"\/><\/a>/g;

var usernameURLRegex = exports.usernameURLRegex = /@([^/]+)/;

var categoryRegex = exports.categoryRegex = /\/([^/]+)/;

exports.default = null;
