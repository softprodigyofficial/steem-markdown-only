'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidImage = exports.getProxyImageURL = exports.MAXIMUM_UPLOAD_SIZE_HUMAN = exports.MAXIMUM_UPLOAD_SIZE = undefined;

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IMG_PROXY = 'https://steemitimages.com/0x0/';
var IMG_PROXY_PREVIEW = 'https://steemitimages.com/600x800/';
var IMG_PROXY_SMALL = 'https://steemitimages.com/40x40/';

var MAXIMUM_UPLOAD_SIZE = exports.MAXIMUM_UPLOAD_SIZE = 15728640;
var MAXIMUM_UPLOAD_SIZE_HUMAN = exports.MAXIMUM_UPLOAD_SIZE_HUMAN = (0, _filesize2.default)(MAXIMUM_UPLOAD_SIZE);

var getProxyImageURL = exports.getProxyImageURL = function getProxyImageURL(url, type) {
  if (url.indexOf('https://ipfs.busy.org') === 0) {
    return url;
  } else if (type === 'preview') {
    return '' + IMG_PROXY_PREVIEW + url;
  } else if (type === 'small') {
    return '' + IMG_PROXY_SMALL + url;
  }
  return '' + IMG_PROXY + url;
};

var isValidImage = exports.isValidImage = function isValidImage(file) {
  return file.type.match('image/.*') && file.size <= MAXIMUM_UPLOAD_SIZE;
};

exports.default = null;
