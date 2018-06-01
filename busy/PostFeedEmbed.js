'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

//~ require('./PostFeedEmbed.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PostFeedEmbed = function (_React$Component) {
  _inherits(PostFeedEmbed, _React$Component);

  function PostFeedEmbed(props) {
    _classCallCheck(this, PostFeedEmbed);

    var _this = _possibleConstructorReturn(this, (PostFeedEmbed.__proto__ || Object.getPrototypeOf(PostFeedEmbed)).call(this, props));

    _this.handleThumbClick = function (e) {
      e.preventDefault();
      _this.setState({ showIframe: true });
    };

    _this.renderWithIframe = function (embed) {
      return (
        // eslint-disable-next-line react/no-danger
        _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: embed } })
      );
    };

    _this.state = {
      showIframe: false
    };
    return _this;
  }

  _createClass(PostFeedEmbed, [{
    key: 'renderThumbFirst',
    value: function renderThumbFirst(thumb) {
      return _react2.default.createElement(
        'div',
        { role: 'presentation', className: 'PostFeedEmbed', onClick: this.handleThumbClick },
        _react2.default.createElement(
          'div',
          { className: 'PostFeedEmbed__playButton' },
          _react2.default.createElement('i', { className: 'iconfont icon-group icon-playon_fill' })
        ),
        _react2.default.createElement('img', { alt: 'thumbnail', className: 'PostFeedEmbed__preview', src: thumb })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          embed = _props.embed,
          inPost = _props.inPost;

      var shouldRenderThumb = inPost ? false : !this.state.showIframe;

      if ((embed.provider_name === 'YouTube' || embed.provider_name === 'DTube') && shouldRenderThumb) {
        return this.renderThumbFirst(embed.thumbnail);
      } else if (embed.embed) {
        return this.renderWithIframe(embed.embed);
      }
      return _react2.default.createElement('div', null);
    }
  }]);

  return PostFeedEmbed;
}(_react2.default.Component);

PostFeedEmbed.propTypes = {
  embed: _propTypes2.default.shape({
    provider_name: _propTypes2.default.string,
    thumbnail: _propTypes2.default.string,
    embed: _propTypes2.default.string
  }).isRequired,
  inPost: _propTypes2.default.bool
};
PostFeedEmbed.defaultProps = {
  inPost: false
};
exports.default = PostFeedEmbed;
