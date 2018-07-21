'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reflux Actions
var Actions = _reflux2.default.createActions(['startUpdate', 'statusUpdate', 'finishUpdate']);

// Reflux Store

var StatusStore = function (_Reflux$Store) {
	_inherits(StatusStore, _Reflux$Store);

	function StatusStore() {
		_classCallCheck(this, StatusStore);

		console.log("Initializing the store");

		var _this = _possibleConstructorReturn(this, (StatusStore.__proto__ || Object.getPrototypeOf(StatusStore)).call(this));

		_this._create = function (canvas) {
			// The random number is a js implementation of the Xorshift PRNG
			var randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

			var seedrand = function seedrand(seed) {
				for (var i = 0; i < randseed.length; i++) {
					randseed[i] = 0;
				}
				for (var i = 0; i < seed.length; i++) {
					randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
				}
			};

			var rand = function rand() {
				// based on Java's String.hashCode(), expanded to 4 32bit values
				var t = randseed[0] ^ randseed[0] << 11;

				randseed[0] = randseed[1];
				randseed[1] = randseed[2];
				randseed[2] = randseed[3];
				randseed[3] = randseed[3] ^ randseed[3] >> 19 ^ t ^ t >> 8;

				return (randseed[3] >>> 0) / (1 << 31 >>> 0);
			};

			var createColor = function createColor() {
				//saturation is the whole color spectrum
				var h = Math.floor(rand() * 360);
				//saturation goes from 40 to 100, it avoids greyish colors
				var s = rand() * 60 + 40 + '%';
				//lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
				var l = (rand() + rand() + rand() + rand()) * 25 + '%';

				var color = 'hsl(' + h + ',' + s + ',' + l + ')';
				return color;
			};

			var createImageData = function createImageData(size) {
				var width = size; // Only support square icons for now
				var height = size;

				var dataWidth = Math.ceil(width / 2);
				var mirrorWidth = width - dataWidth;

				var data = [];
				for (var y = 0; y < height; y++) {
					var row = [];
					for (var x = 0; x < dataWidth; x++) {
						// this makes foreground and background color to have a 43% (1/2.3) probability
						// spot color has 13% chance
						row[x] = Math.floor(rand() * 2.3);
					}
					var r = row.slice(0, mirrorWidth);
					r.reverse();
					row = row.concat(r);

					for (var i = 0; i < row.length; i++) {
						data.push(row[i]);
					}
				}

				return data;
			};

			var buildOpts = function buildOpts(address) {
				var newOpts = {};

				newOpts.seed = address;
				seedrand(newOpts.seed);

				newOpts.size = 11;
				newOpts.scale = 6;
				newOpts.color = createColor();
				newOpts.bgcolor = createColor();
				newOpts.spotcolor = createColor();

				return newOpts;
			};

			var renderIcon = function renderIcon(opts, canvas) {
				var imageData = createImageData(opts.size);
				var width = Math.sqrt(imageData.length);
				var cc = canvas.getContext('2d');

				canvas.width = canvas.height = opts.size * opts.scale;

				cc.clearRect(0, 0, canvas.width, canvas.height);
				cc.fillStyle = opts.bgcolor;
				cc.fillRect(0, 0, canvas.width, canvas.height);
				cc.fillStyle = opts.color;

				for (var i = 0; i < imageData.length; i++) {

					// if data is 0, leave the background
					if (imageData[i]) {
						var row = Math.floor(i / width);
						var col = i % width;

						// if data is 2, choose spot color, if 1 choose foreground
						cc.fillStyle = imageData[i] == 1 ? opts.color : opts.spotcolor;

						cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
					}
				}

				return canvas;
			};

			var hex_address = _this.state.address.replace('x', '0');
			if (hex_address.match(/[0-9a-f]{42}/ig)) {
				var opts = buildOpts(_this.state.address);
				return renderIcon(opts, canvas);
			}
		};

		_this.state = { balances: { 'ETH': 0 }, address: '' }; // <- set store's default state much like in React
		_this.tokenList = ['TTT'];
		_this._count;
		_this._target;
		_this.WT = _CastIronService2.default.wallet;
		_this.state.accounts = _this.WT.web3.eth.accounts;

		_this.listenables = Actions;
		return _this;
	}

	_createClass(StatusStore, [{
		key: 'onStartUpdate',
		value: function onStartUpdate(address, canvas) {
			var _this2 = this;

			this._count = 0;
			this._target = this.tokenList.length + 1;

			this.WT.setAccount(address);
			this.setState({ address: address });
			this.WT.hotGroups(this.tokenList);

			this.tokenList.map(function (t) {
				Actions.statusUpdate(_defineProperty({}, t, Number(_this2.WT.toEth(_this2.WT.addrTokenBalance(t)(_this2.WT.userWallet), _this2.WT.TokenList[t].decimals).toFixed(9))));
			});

			Actions.statusUpdate({ 'ETH': Number(this.WT.toEth(this.WT.addrEtherBalance(this.WT.userWallet), this.WT.TokenList['ETH'].decimals).toFixed(9)) });

			this._create(canvas);
		}
	}, {
		key: 'onStatusUpdate',
		value: function onStatusUpdate(status) {
			this._count++;

			this.setState({ balances: _extends({}, this.state.balances, status) });

			if (this._count == this._target) Actions.finishUpdate();
		}
	}]);

	return StatusStore;
}(_reflux2.default.Store);

// Reflux components

var GenSheets = function (_Reflux$Component) {
	_inherits(GenSheets, _Reflux$Component);

	function GenSheets(props) {
		_classCallCheck(this, GenSheets);

		var _this3 = _possibleConstructorReturn(this, (GenSheets.__proto__ || Object.getPrototypeOf(GenSheets)).call(this, props));

		_this3.render = function () {
			if (_this3.state.address == '') return _react2.default.createElement('p', null);

			var balanceSheet = Object.keys(_this3.state.balances).map(function (b) {
				if (b == 'ETH') {
					return _react2.default.createElement(
						'tr',
						{ key: b, className: 'balance-sheet' },
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet', width: '185' },
							b,
							':'
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_this3.state.balances[b]
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_react2.default.createElement('input', { type: 'button', className: 'button', value: 'send' })
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_react2.default.createElement('input', { type: 'button', className: 'button', value: 'buy', disabled: true })
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_react2.default.createElement('input', { type: 'button', className: 'button', value: 'sell', disabled: true })
						)
					);
				} else {
					return _react2.default.createElement(
						'tr',
						{ key: b, className: 'balance-sheet' },
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet', width: '185' },
							b,
							':'
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_this3.state.balances[b]
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_react2.default.createElement('input', { type: 'button', className: 'button', value: 'send' })
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_react2.default.createElement('input', { type: 'button', className: 'button', value: 'buy' })
						),
						_react2.default.createElement(
							'td',
							{ className: 'balance-sheet' },
							_react2.default.createElement('input', { type: 'button', className: 'button', value: 'sell' })
						)
					);
				}
			});

			return _react2.default.createElement(
				'table',
				{ className: 'balance-sheet' },
				_react2.default.createElement(
					'tbody',
					null,
					_react2.default.createElement(
						'tr',
						null,
						_react2.default.createElement(
							'th',
							{ className: 'balance-sheet' },
							'Types'
						),
						_react2.default.createElement(
							'th',
							{ className: 'balance-sheet' },
							'Amount'
						),
						_react2.default.createElement(
							'th',
							{ className: 'balance-sheet', colSpan: '3' },
							'Actions'
						)
					),
					balanceSheet
				)
			);
		};

		_this3.store = StatusStore;
		return _this3;
	}

	return GenSheets;
}(_reflux2.default.Component);

var QueryForm = function (_Reflux$Component2) {
	_inherits(QueryForm, _Reflux$Component2);

	function QueryForm(props) {
		_classCallCheck(this, QueryForm);

		var _this4 = _possibleConstructorReturn(this, (QueryForm.__proto__ || Object.getPrototypeOf(QueryForm)).call(this, props));

		_this4.handleChange = function (event) {
			Actions.startUpdate(event.value, _this4.refs.canvas);
		};

		_this4.render = function () {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'table',
					null,
					_react2.default.createElement(
						'tbody',
						null,
						_react2.default.createElement(
							'tr',
							null,
							_react2.default.createElement(
								'td',
								{ className: 'avatar', width: 201 },
								_react2.default.createElement('canvas', { ref: 'canvas', width: 66, height: 66, style: {
										border: "3px solid #ccc",
										borderBottomLeftRadius: "2.8em",
										borderBottomRightRadius: "2.8em",
										borderTopRightRadius: "2.8em",
										borderTopLeftRadius: "2.8em"
									}
								})
							),
							_react2.default.createElement(
								'td',
								null,
								_react2.default.createElement(
									'label',
									null,
									'Address:',
									_react2.default.createElement(_reactDropdown2.default, { ref: 'addrlist', options: _this4.state.accounts, onChange: _this4.handleChange, value: _this4.state.address, placeholder: 'Select an option' })
								)
							)
						),
						_react2.default.createElement(
							'tr',
							null,
							_react2.default.createElement(
								'td',
								{ colSpan: '2' },
								_react2.default.createElement(GenSheets, null)
							)
						)
					)
				)
			);
		};

		_this4.store = StatusStore;
		return _this4;
	}

	return QueryForm;
}(_reflux2.default.Component);

exports.default = QueryForm;