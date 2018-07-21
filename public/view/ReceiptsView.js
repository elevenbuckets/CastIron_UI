'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _SendTX = require('../components/SendTX');

var _SendTX2 = _interopRequireDefault(_SendTX);

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _Receipts = require('../components/Receipts');

var _Receipts2 = _interopRequireDefault(_Receipts);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _TxQList = require('./TxQList');

var _TxQList2 = _interopRequireDefault(_TxQList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReceiptsView = function (_Reflux$Component) {
    _inherits(ReceiptsView, _Reflux$Component);

    function ReceiptsView(props) {
        _classCallCheck(this, ReceiptsView);

        var _this = _possibleConstructorReturn(this, (ReceiptsView.__proto__ || Object.getPrototypeOf(ReceiptsView)).call(this, props));

        _this.handleChange = function (event) {
            _this.setState({ selectedQ: event.value });
        };

        _this.getReceipts = function () {
            return _this.state.receipts[_this.state.selectedQ];
        };

        _this.store = _CastIronStore2.default;
        _this.wallet = _CastIronService2.default.wallet;
        _this.state = {
            selectedQ: ""
        };
        _this.storeKeys = ["receipts", "Qs"];

        _this.getReceipts = _this.getReceipts.bind(_this);

        return _this;
    }

    _createClass(ReceiptsView, [{
        key: 'render',
        value: function render() {
            console.log("in ReceiptsView render()");
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'table',
                    { className: 'balance-sheet' },
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _react2.default.createElement(
                            'tr',
                            { className: 'avatar', style: { textAlign: "center" } },
                            _react2.default.createElement(
                                'th',
                                { colSpan: '2', className: 'avatar', style: { textAlign: "center" } },
                                'Receipts'
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            { className: 'balance-sheet' },
                            _react2.default.createElement(
                                'td',
                                { className: 'balance-sheet', width: '17%' },
                                'Queue IDs:'
                            ),
                            _react2.default.createElement(
                                'td',
                                { className: 'balance-sheet' },
                                _react2.default.createElement(_reactDropdown2.default, { options: this.state.Qs, onChange: this.handleChange,
                                    value: this.state.selectedQ, placeholder: 'Please select a Queue ID' })
                            )
                        )
                    )
                ),
                _react2.default.createElement(_Receipts2.default, { receipts: this.getReceipts(),
                    style: { marginTop: '0', marginBottom: '0', paddingTop: '0', paddingBottom: '0' } })
            );
        }
    }]);

    return ReceiptsView;
}(_reflux2.default.Component);

exports.default = ReceiptsView;