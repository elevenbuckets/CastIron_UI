'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reflux components

var Drawer = function (_Reflux$Component) {
	_inherits(Drawer, _Reflux$Component);

	function Drawer(props) {
		_classCallCheck(this, Drawer);

		var _this = _possibleConstructorReturn(this, (Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call(this, props));

		_this.handleIconClick = function (appView, event) {
			_this.changeView(appView);
			_this.props.handleClick(event);
		};

		_this.render = function () {
			return _react2.default.createElement(
				'div',
				{ id: 'drawer', className: _this.props.draw ? 'raise' : 'close' },
				_react2.default.createElement(
					'div',
					{ className: 'card', onClick: _this.handleIconClick.bind(_this, 'Transfer') },
					_react2.default.createElement('img', { src: 'assets/transfer-icon.png', style: { width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" } }),
					_react2.default.createElement(
						'p',
						{ style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" } },
						'Wallet'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'card', onClick: _this.handleIconClick.bind(_this, 'Scheduler') },
					_react2.default.createElement('img', { src: 'assets/clock-icon.png', style: { width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" } }),
					_react2.default.createElement(
						'p',
						{ style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" } },
						'Schedular'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'card' },
					_react2.default.createElement('img', { src: 'assets/forum-icon.png', style: { width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" } }),
					_react2.default.createElement(
						'p',
						{ style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" } },
						'Forum'
					),
					_react2.default.createElement(
						'div',
						{ className: 'label-soon' },
						'Comming Soon!'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'card' },
					_react2.default.createElement('img', { src: 'assets/delegate-icon.png', style: { width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" } }),
					_react2.default.createElement(
						'p',
						{ style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" } },
						'Delegates'
					),
					_react2.default.createElement(
						'div',
						{ className: 'label-soon' },
						'Comming Soon!'
					)
				)
			);
		};

		return _this;
	}

	_createClass(Drawer, [{
		key: 'changeView',
		value: function changeView(view) {
			_CastIronActions2.default.changeView(view);
		}
	}]);

	return Drawer;
}(_reflux2.default.Component);

exports.default = Drawer;