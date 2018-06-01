'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remarkable = undefined;
exports.getHtml = getHtml;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _sanitizeHtml = require('sanitize-html');

var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

var _remarkable = require('remarkable');

var _remarkable2 = _interopRequireDefault(_remarkable);

var _embedjs = require('embedjs');

var _embedjs2 = _interopRequireDefault(_embedjs);

var _formatter = require('./formatter');

var _SanitizeConfig = require('./SanitizeConfig');

var _SanitizeConfig2 = _interopRequireDefault(_SanitizeConfig);

var _regexHelpers = require('./regexHelpers');

var _steemitHtmlReady = require('./steemitHtmlReady');

var _steemitHtmlReady2 = _interopRequireDefault(_steemitHtmlReady);

var _PostFeedEmbed = require('./PostFeedEmbed');

var _PostFeedEmbed2 = _interopRequireDefault(_PostFeedEmbed);

//~ require('./Body.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var remarkable = exports.remarkable = new _remarkable2.default({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});

var getEmbed = function getEmbed(link) {
  var embed = _embedjs2.default.get(link, { width: '100%', height: 400, autoplay: false });

  if (_lodash2.default.isUndefined(embed)) {
    return {
      provider_name: '',
      thumbnail: '',
      embed: link
    };
  }

  return embed;
};

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object
function getHtml(body) {
  var jsonMetadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var returnType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Object';
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var parsedJsonMetadata = (0, _formatter.jsonParse)(jsonMetadata) || {};
  parsedJsonMetadata.image = parsedJsonMetadata.image || [];

  var parsedBody = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  parsedBody = parsedBody.replace(/^\s+</gm, '<');

  parsedBody.replace(_regexHelpers.imageRegex, function (img) {
    if (_lodash2.default.filter(parsedJsonMetadata.image, function (i) {
      return i.indexOf(img) !== -1;
    }).length === 0) {
      parsedJsonMetadata.image.push(img);
    }
  });

  var htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };
  parsedBody = remarkable.render(parsedBody);
  parsedBody = (0, _steemitHtmlReady2.default)(parsedBody, htmlReadyOptions).html;
  parsedBody = parsedBody.replace(_regexHelpers.dtubeImageRegex, '');
  parsedBody = (0, _sanitizeHtml2.default)(parsedBody, (0, _SanitizeConfig2.default)({}));
  if (returnType === 'text') {
    return parsedBody;
  }

  if (options.rewriteLinks) {
    parsedBody = parsedBody.replace(/"https?:\/\/(?:www)?steemit.com\/([A-Za-z0-9@/\-.]*)"/g, function (match, p1) {
      return '"/' + p1 + '"';
    });
  }

  parsedBody = parsedBody.replace(/https:\/\/ipfs\.busy\.org\/ipfs\/(\w+)/g, function (match, p1) {
    return 'https://gateway.ipfs.io/ipfs/' + p1;
  });

  var sections = [];

  var splittedBody = parsedBody.split('~~~ embed:');
  for (var i = 0; i < splittedBody.length; i += 1) {
    var section = splittedBody[i];

    var match = section.match(/^([A-Za-z0-9_-]+) ([A-Za-z]+) (\S+) ~~~/);
    if (match && match.length >= 4) {
      var id = match[1];
      var type = match[2];
      var link = match[3];
      var embed = getEmbed(link);
      sections.push(_server2.default.renderToString(_react2.default.createElement(_PostFeedEmbed2.default, { key: 'embed-a-' + i, inPost: true, embed: embed })));
      section = section.substring((id + ' ' + type + ' ' + link + ' ~~~').length);
    }
    if (section !== '') {
      sections.push(section);
    }
  }
  // eslint-disable-next-line react/no-danger
  return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: sections.join('') } });
}

var Body = function Body(props) {
  var options = {
    rewriteLinks: props.rewriteLinks
  };
  var htmlSections = getHtml(props.body, props.jsonMetadata, 'Object', options);
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)('Body', { 'Body--full': props.full }) },
    htmlSections
  );
};

Body.propTypes = {
  body: _propTypes2.default.string,
  jsonMetadata: _propTypes2.default.string,
  full: _propTypes2.default.bool,
  rewriteLinks: _propTypes2.default.bool
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  full: false,
  rewriteLinks: false
};

exports.default = Body;
