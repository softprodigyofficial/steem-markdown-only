"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jsonParse = exports.jsonParse = function jsonParse(str) {
  try {
    return jsonParse(JSON.parse(str));
  } catch (e) {
    return str;
  }
};

var epochToUTC = exports.epochToUTC = function epochToUTC(epochTimestamp) {
  return new Date(0).setUTCSeconds(epochTimestamp);
};

exports.default = jsonParse;
