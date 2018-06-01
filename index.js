'use strict';

var _Body = require('./busy/Body');

function steemMarkdown(markdown) {
  return (0, _Body.getHtml)(markdown, {}, 'text');
}

module.exports = steemMarkdown;
