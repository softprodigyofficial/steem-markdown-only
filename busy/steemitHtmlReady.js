'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * This function is extracted from steemit.com source code and does the same tasks with some slight-
                                                                                                                                                                                                                                                                   * adjustments to meet our needs(Removed Embed and ipfs related code). Refer to the main one in case of future problems:
                                                                                                                                                                                                                                                                   * https://github.com/steemit/steemit.com/blob/2c2b89a6745aebec1fa45453f31362d700f1bfb7/shared/HtmlReady.js
                                                                                                                                                                                                                                                                   */

exports.default = function (html) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$mutate = _ref.mutate,
      mutate = _ref$mutate === undefined ? true : _ref$mutate,
      resolveIframe = _ref.resolveIframe;

  var state = { mutate: mutate, resolveIframe: resolveIframe };
  state.hashtags = new Set();
  state.usertags = new Set();
  state.htmltags = new Set();
  state.images = new Set();
  state.links = new Set();
  try {
    var doc = DOMParser.parseFromString(html, 'text/html');
    traverse(doc, state);
    if (mutate) proxifyImages(doc);
    // console.log('state', state)
    if (!mutate) return state;
    return _extends({ html: doc ? XMLSerializer.serializeToString(doc) : '' }, state);
  } catch (error) {
    // Not Used, parseFromString might throw an error in the future
    console.error(error.toString());
    return { html: html };
  }
};

var _embedjs = require('embedjs');

var _embedjs2 = _interopRequireDefault(_embedjs);

var _slice = require('lodash/slice');

var _slice2 = _interopRequireDefault(_slice);

var _xmldom = require('xmldom');

var _xmldom2 = _interopRequireDefault(_xmldom);

var _steemitLinks = require('./steemitLinks');

var _steemitLinks2 = _interopRequireDefault(_steemitLinks);

var _ChainValidation = require('./ChainValidation');

var _image = require('./image');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noop = function noop() {};
var DOMParser = new _xmldom2.default.DOMParser({
  errorHandler: { warning: noop, error: noop }
});
var XMLSerializer = new _xmldom2.default.XMLSerializer();

/**
 * Functions performed by HTMLReady
 *
 * State reporting
 *  - hashtags: collect all #tags in content
 *  - usertags: collect all @mentions in content
 *  - htmltags: collect all html <tags> used (for validation)
 *  - images: collect all image URLs in content
 *  - links: collect all href URLs in content
 *
 * Mutations
 *  - link()
 *    - ensure all <a> href's begin with a protocol. prepend https:// otherwise.
 *  - iframe()
 *    - wrap all <iframe>s in <div class="videoWrapper"> for responsive sizing
 *  - img()
 *    - convert any <img> src IPFS prefixes to standard URL
 *    - change relative protocol to https://
 *  - linkifyNode()
 *    - scans text content to be turned into rich content
 *    - embedYouTubeNode()
 *      - identify plain youtube URLs and prep them for "rich embed"
 *    - linkify()
 *      - scan text for:
 *        - #tags, convert to <a> links
 *        - @mentions, convert to <a> links
 *        - naked URLs
 *          - if img URL, normalize URL and convert to <img> tag
 *          - otherwise, normalize URL and convert to <a> link
 *  - proxifyImages()
 *    - prepend proxy URL to any non-local <img> src's
 *
 * We could implement 2 levels of HTML mutation for maximum reuse:
 *  1. Normalization of HTML - non-proprietary, pre-rendering cleanup/normalization
 *    - (state reporting done at this level)
 *    - normalize URL protocols
 *    - convert naked URLs to images/links
 *    - convert embeddable URLs to <iframe>s
 *    - basic sanitization?
 *  2. Steemit.com Rendering - add in proprietary Steemit.com functions/links
 *    - convert <iframe>s to custom objects
 *    - linkify #tags and @mentions
 *    - proxify images
 *
 * TODO:
 *  - change url to normalizeUrl(url)
 *    - rewrite IPFS prefixes to valid URLs
 *    - schema normalization
 *    - gracefully handle protocols like ftp, mailto
 */

/** Split the HTML on top-level elements. This allows react to compare separately, preventing excessive re-rendering.
 * Used in MarkdownViewer.jsx
 */
// export function sectionHtml (html) {
//   const doc = DOMParser.parseFromString(html, 'text/html')
//   const sections = Array(...doc.childNodes).map(child => XMLSerializer.serializeToString(child))
//   return sections
// }

/** Embed videos, link mentions and hashtags, etc...
 */


function traverse(node, state) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!node || !node.childNodes) return;
  Array.apply(undefined, _toConsumableArray(node.childNodes)).forEach(function (child) {
    // console.log(depth, 'child.tag,data', child.tagName, child.data)
    var tag = child.tagName ? child.tagName.toLowerCase() : null;
    if (tag) state.htmltags.add(tag);

    if (tag === 'img') img(state, child);else if (tag === 'iframe') iframe(state, child);else if (tag === 'a') link(state, child);else if (child.nodeName === '#text') linkifyNode(child, state);

    traverse(child, state, depth + 1);
  });
}

function link(state, child) {
  var url = child.getAttribute('href');
  if (url) {
    state.links.add(url);
    if (state.mutate) {
      // If this link is not relative, http, or https -- add https.
      if (!/^\/(?!\/)|(https?:)?\/\//.test(url)) {
        child.setAttribute('href', 'https://' + url);
      }
    }
  }
}

// wrap iframes in div.videoWrapper to control size/aspect ratio
function iframe(state, child) {
  var url = child.getAttribute('src');
  var domString = void 0;
  var embed = _embedjs2.default.get(url || '', { width: '100%', height: 400 });
  if (embed && embed.id) {
    var images = state.images,
        links = state.links;

    links.add(embed.url);
    images.add('https://img.youtube.com/vi/' + embed.id + '/0.jpg');
    if (!resolveIframe) domString = '~~~ embed:' + embed.id + ' ' + embed.provider_name + ' ' + embed.url + ' ~~~';
  }

  var mutate = state.mutate,
      resolveIframe = state.resolveIframe;

  if (!mutate) return;

  var tag = child.parentNode.tagName ? child.parentNode.tagName.toLowerCase() : child.parentNode.tagName;
  if (tag === 'div' && child.parentNode.getAttribute('class') === 'videoWrapper') return;
  var html = XMLSerializer.serializeToString(child);
  if (resolveIframe) domString = '<div class="videoWrapper">' + html + '</div>';
  child.parentNode.replaceChild(DOMParser.parseFromString(domString), child);
}

function img(state, child) {
  var url = child.getAttribute('src');
  if (url) {
    state.images.add(url);
    if (state.mutate) {
      var url2 = url;
      if (/^\/\//.test(url2)) {
        // Change relative protocol imgs to https
        url2 = 'https:' + url2;
      }
      if (url2 !== url) {
        child.setAttribute('src', url2);
      }
    }
  }
}

// For all img elements with non-local URLs, prepend the proxy URL (e.g. `https://img0.steemit.com/0x0/`)
function proxifyImages(doc) {
  if (!doc) return;
  [].concat(_toConsumableArray(doc.getElementsByTagName('img'))).forEach(function (node) {
    var url = node.getAttribute('src');
    if (!_steemitLinks2.default.local.test(url)) {
      node.setAttribute('src', (0, _image.getProxyImageURL)(url));
    }
  });
}

function linkifyNode(child, state) {
  try {
    var tag = child.parentNode.tagName ? child.parentNode.tagName.toLowerCase() : child.parentNode.tagName;
    if (tag === 'code') return;
    if (tag === 'a') return;

    var mutate = state.mutate;

    if (!child.data) return;

    if (isEmbedable(child, state.links, state.images, state.resolveIframe)) return;

    var data = XMLSerializer.serializeToString(child);
    var content = linkify(data, state.mutate, state.hashtags, state.usertags, state.images, state.links);
    if (mutate && content !== data) {
      var newChild = DOMParser.parseFromString('<span>' + content + '</span>');
      child.parentNode.replaceChild(newChild, child);
      return newChild;
    }
  } catch (error) {
    console.log(error);
  }
}

function linkify(content, mutate, hashtags, usertags, images, links) {
  content = content.replace(_steemitLinks2.default.any, function (ln) {
    if (_steemitLinks2.default.image.test(ln)) {
      if (images) images.add(ln);
      return '<img src="' + ln + '" />';
    }

    // do not linkify .exe or .zip urls
    if (/\.(zip|exe)$/i.test(ln)) return ln;

    if (links) links.add(ln);
    return '<a href="' + ln + '">' + ln + '</a>';
  });

  // hashtag
  content = content.replace(/(^|\s)(#[-a-z\d]+)/gi, function (tag) {
    if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
    var space = /^\s/.test(tag) ? tag[0] : '';
    var tag2 = tag.trim().substring(1);
    var tagLower = tag2.toLowerCase();
    if (hashtags) hashtags.add(tagLower);
    if (!mutate) return tag;
    return space + '<a href="/trending/' + tagLower + '">' + tag + '</a>';
  });

  // usertag (mention)
  content = content.replace(/(^|\s)(@[a-z][-\.a-z\d]+[a-z\d])/gi, function (user) {
    var space = /^\s/.test(user) ? user[0] : '';
    var user2 = user.trim().substring(1);
    var userLower = user2.toLowerCase();
    var valid = (0, _ChainValidation.validateAccountName)(userLower) == null;
    if (valid && usertags) usertags.add(userLower);
    if (!mutate) return user;
    return space + (valid ? '<a href="/@' + userLower + '">@' + user2 + '</a>' : '@' + user2);
  });
  return content;
}

function isEmbedable(child, links, images, resolveIframe) {
  try {
    if (!child.data) return false;
    var data = child.data;
    var foundLinks = data.match(_steemitLinks2.default.any);
    if (!foundLinks) return false;
    var embed = _embedjs2.default.get(foundLinks[0] || '', { width: '100%', height: 400 });
    if (embed && embed.id) {
      var domString = resolveIframe ? embed.embed : (0, _slice2.default)(data, 0, foundLinks.index) + '~~~ embed:' + embed.id + ' ' + embed.provider_name + ' ' + embed.url + ' ~~~' + (0, _slice2.default)(data, foundLinks.index + foundLinks[0].length, data.length);
      var v = DOMParser.parseFromString(domString);
      child.parentNode.replaceChild(v, child);
      // console.trace('embed.embed', v);
      if (links) links.add(embed.url);
      if (images) images.add('https://img.youtube.com/vi/' + embed.id + '/0.jpg');
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/** @return {id, url} or <b>null</b> */
function youTubeId(data) {
  if (!data) return null;

  var m1 = data.match(_steemitLinks2.default.youTube);
  var url = m1 ? m1[0] : null;
  if (!url) return null;

  var m2 = url.match(_steemitLinks2.default.youTubeId);
  var id = m2 && m2.length >= 2 ? m2[1] : null;
  if (!id) return null;

  return { id: id, url: url };
}
