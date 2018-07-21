'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SellShop = function (_React$Component) {
	_inherits(SellShop, _React$Component);

	function SellShop(props) {
		_classCallCheck(this, SellShop);

		var _this = _possibleConstructorReturn(this, (SellShop.__proto__ || Object.getPrototypeOf(SellShop)).call(this, props));

		_this.balanceBar = function () {
			var secureDeposit = _this.props.paidback ? 0 : _this.props.shopDeposit;
			var earnings = _this.props.shopBalance - secureDeposit;

			var outlooks = 0;
			if (_this.props.sellOrder) {
				outlooks = Number(_this.props.sellOrder["amount"]) * Number(_this.props.sellOrder["price"]);
			}
			var grandTotal = Number(_this.props.shopBalance) + Number(outlooks);

			var __round2 = function __round2(num) {
				// num must <= 1
				var bigint = String(num * 10000);
				if (bigint.indexOf('.') == '-1') bigint = bigint + '.';
				bigint = bigint.substring(0, bigint.indexOf('.'));
				if (Number(bigint) == 0) {
					return '0.00';
				} else {
					var front = bigint.substring(0, bigint.length - 2) == '' ? '0' : bigint.substring(0, bigint.length - 2);
					var back = bigint.substring(bigint.length - 2, bigint.length) == '' ? '00' : bigint.substring(bigint.length - 2, bigint.length);
					if (back.length < 2) return front + '.0' + back;
					return front + '.' + back;
				}
			};

			var barOne = __round2(secureDeposit / grandTotal);
			var barTwo = __round2(earnings / grandTotal);
			var barOnePercent = barOne + '%';
			var barTwoPercent = barTwo + '%';
			var barThreePercent = outlooks == 0 ? '0.00%' : __round2((100 - barOne - barTwo) / 100) + '%';

			if (grandTotal === 0) {
				if (_this.props.totalOrders == 0) {
					return _react2.default.createElement(
						'div',
						null,
						' Ready for new order? Create one below! '
					);
				} else {
					return _react2.default.createElement(
						'div',
						null,
						' Sold out and cashed out! Please restock! '
					);
				}
			};

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'stacked-bar-graph' },
					_react2.default.createElement('span', { style: {
							display: "inline-block",
							height: "90%",
							width: barOnePercent,
							boxSizing: "border-box",
							float: "left",
							fontWeight: "bold",
							padding: '10px 0px 10px 0px',
							backgroundColor: "#F7B334"
						} }),
					_react2.default.createElement('span', { style: {
							display: "inline-block",
							height: "90%",
							width: barTwoPercent,
							boxSizing: "border-box",
							float: "left",
							fontWeight: "bold",
							padding: '10px 0px 10px 0px',
							backgroundColor: "#D57E00"
						} }),
					_react2.default.createElement('span', { style: {
							display: "inline-block",
							height: "90%",
							width: barThreePercent,
							boxSizing: "border-box",
							float: "left",
							fontWeight: "bold",
							padding: '10px 0px 10px 0px',
							backgroundColor: "#A7A9AC"
						} })
				),
				_react2.default.createElement(
					'table',
					{ style: { width: '100%', height: "35px", textAlign: 'center' } },
					_react2.default.createElement(
						'tbody',
						null,
						_react2.default.createElement(
							'tr',
							{ className: 'txfrom', style: { textAlign: 'center' } },
							_react2.default.createElement(
								'td',
								{ className: 'txform', style: { textAlign: 'center', fontWeight: 'bold', border: '0px' } },
								'Balance:'
							),
							_react2.default.createElement(
								'td',
								{ className: 'txform', style: { textAlign: 'center', border: '0px' } },
								_react2.default.createElement(
									'label',
									{ style: { marginRight: "20px" } },
									_react2.default.createElement('div', { style: { display: 'inline-block', backgroundColor: "#F7B334", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px' } }),
									"Deposit: " + barOnePercent
								),
								_react2.default.createElement(
									'label',
									{ style: { marginRight: "20px" } },
									_react2.default.createElement('div', { style: { display: 'inline-block', backgroundColor: "#D57E00", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px' } }),
									"Earned: " + barTwoPercent
								)
							),
							_react2.default.createElement(
								'td',
								{ className: 'txform', style: { textAlign: 'center', fontWeight: 'bold', border: '0px' } },
								'Projected:'
							),
							_react2.default.createElement(
								'td',
								{ className: 'txform', style: { textAlign: 'center', border: '0px' } },
								_react2.default.createElement(
									'label',
									{ style: { marginRight: "20px" } },
									_react2.default.createElement('div', { style: { display: 'inline-block', backgroundColor: "#A7A9AC", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px' } }),
									"Active Order: " + barThreePercent
								)
							)
						)
					)
				)
			);
		};

		_this.state = {
			otherstores: []
		};
		return _this;
	}

	_createClass(SellShop, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ style: { padding: "20px" } },
				_react2.default.createElement(
					'table',
					{ className: 'balance-sheet' },
					_react2.default.createElement(
						'tbody',
						null,
						_react2.default.createElement(
							'tr',
							{ className: 'balance-sheet' },
							_react2.default.createElement(
								'td',
								{ className: 'balance-sheet' },
								'Shop Address'
							),
							_react2.default.createElement(
								'td',
								{ className: 'balance-sheet', style: { color: '#111111' }, width: '80%' },
								_react2.default.createElement(_reactDropdown2.default, { options: this.props.shopAddrs,
									onChange: this.props.useOtherStore,
									value: '',
									placeholder: this.props.disableCreateStore ? this.props.shopAddr : 'Use other shops' })
							),
							this.props.disableCreateStore && this.props.totalTake > 0 ? _react2.default.createElement(
								'td',
								{ className: 'balance-sheet', style: { minWidth: '146px', whiteSpace: 'nowrap' } },
								'Available: ',
								_react2.default.createElement('br', null),
								this.props.totalTake + " ETH"
							) : null
						),
						_react2.default.createElement(
							'tr',
							{ className: 'balance-sheet' },
							_react2.default.createElement(
								'td',
								{ className: 'balance-sheet', rowSpan: '2' },
								' ',
								_react2.default.createElement('input', { type: 'button',
									className: 'button', value: 'Create Store', disabled: this.props.disableCreateStore,
									onClick: this.props.createStore })
							),
							_react2.default.createElement(
								'td',
								{ className: 'balance-sheet', rowSpan: this.props.disableCreateStore ? 2 : 1 },
								this.props.disableCreateStore ? this.balanceBar() : "Estimate Gas Cost: 2000000"
							),
							this.props.disableCreateStore && this.props.totalTake > 0 ? _react2.default.createElement(
								'td',
								{ className: 'balance-sheet', rowSpan: '2' },
								_react2.default.createElement('input', { type: 'button', className: 'button', value: 'Withdraw', onClick: this.props.withdraw })
							) : null
						),
						this.props.disableCreateStore ? null : _react2.default.createElement(
							'tr',
							{ className: 'balance-sheet' },
							_react2.default.createElement(
								'td',
								{ className: 'balance-sheet', style: { background: "#ffffff" } },
								"Estimate Deposit :" + this.props.estimateDeposit + "ETH"
							)
						)
					)
				)
			);
		}
	}]);

	return SellShop;
}(_react2.default.Component);

exports.default = SellShop;