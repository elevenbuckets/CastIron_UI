'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _Receipt = require('./Receipt');

var _Receipt2 = _interopRequireDefault(_Receipt);

var _Constants = require('../util/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Receipts = function (_Reflux$Component) {
    _inherits(Receipts, _Reflux$Component);

    function Receipts(props) {
        _classCallCheck(this, Receipts);

        var _this = _possibleConstructorReturn(this, (Receipts.__proto__ || Object.getPrototypeOf(Receipts)).call(this, props));

        _this.simplifyTxHash = function (content) {
            if (content) {
                var res = content.substring(0, 5);
                res = res + "...";
                var length = content.length;
                res = res + content.substring(length - 5, length);
                return res;
            } else {
                return null;
            }
        };

        _this.getGasPrice = function (receipt) {
            return _CastIronService2.default.wallet.toEth(_CastIronService2.default.wallet.hex2num(receipt.gasPrice), 9).toFixed(9);
        };

        _this.getStatusComponent = function (receipt) {
            var status = _this.getStatus(receipt);

            return _react2.default.createElement(
                'td',
                { className: 'balance-sheet',
                    onMouseEnter: status == _Constants2.default.Errored ? _this.infoDisplay.bind(_this, 'Erorr Info ', receipt.error) : function () {},
                    onMouseLeave: status == _Constants2.default.Errored ? _this.infoClear.bind(_this) : function () {}, width: '8%' },
                status
            );
        };

        _this.receipts = function () {
            if (_this.props.receipts) {
                return _this.props.receipts.map(function (receipt) {
                    return _react2.default.createElement(
                        'tr',
                        { className: 'balance-sheet' },
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet',
                                onMouseEnter: _this.infoDisplay.bind(_this, 'txHash', receipt.tx),
                                onMouseLeave: _this.infoClear.bind(_this),
                                width: '10%' },
                            _this.simplifyTxHash(receipt.tx)
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet',
                                onMouseEnter: _this.infoDisplay.bind(_this, 'From', receipt.from),
                                onMouseLeave: _this.infoClear.bind(_this),
                                width: '10%' },
                            _this.simplifyTxHash(receipt.from)
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet',
                                onMouseEnter: _this.infoDisplay.bind(_this, 'To', receipt.to),
                                onMouseLeave: _this.infoClear.bind(_this),
                                width: '10%' },
                            _this.simplifyTxHash(receipt.to)
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet', width: '8%' },
                            _this.getType(receipt)
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet', width: '8%' },
                            _this.getAmount(receipt)
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet', width: '8%' },
                            receipt.gasUsed
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet', width: '8%' },
                            _this.getGasPrice(receipt)
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'balance-sheet', width: '8%' },
                            receipt.blockNumber
                        ),
                        _this.getStatusComponent(receipt)
                    );
                });
            }
        };

        _this.clearTout = undefined;
        return _this;
    }

    _createClass(Receipts, [{
        key: 'getType',
        value: function getType(receipt) {
            if (_Constants2.default.Token === receipt.type || _Constants2.default.Web3 === receipt.type) {
                return receipt.contract;
            }
            return "Function";
        }
    }, {
        key: 'getAmount',
        value: function getAmount(receipt) {
            if (_Constants2.default.Web3 === receipt.type && _Constants2.default.ETH === receipt.contract) {
                return _CastIronService2.default.wallet.toEth(_CastIronService2.default.wallet.hex2num(receipt.value), _CastIronService2.default.wallet.TokenList[_Constants2.default.ETH].decimals).toFixed(9);
            } else if (_Constants2.default.Token === receipt.type) {
                return _CastIronService2.default.wallet.toEth(_CastIronService2.default.wallet.hex2num(receipt.amount), _CastIronService2.default.wallet.TokenList[receipt.contract].decimals).toFixed(9);
            }
            return receipt.amount;
        }
    }, {
        key: 'getStatus',
        value: function getStatus(receipt) {
            if (receipt.status === "0x0") {
                return _Constants2.default.Failed;
            } else if (receipt.status === "0x1") {
                return _Constants2.default.Succeeded;
            } else if (receipt.error) {
                return _Constants2.default.Errored;
            }
            return _Constants2.default.Pending;
        }
    }, {
        key: 'infoDisplay',
        value: function infoDisplay(name, data) {
            event.preventDefault(); // is this necessary?
            clearTimeout(this.clearTout);
            this.refs.infocache.value = name + ': ' + data;
        }
    }, {
        key: 'infoClear',
        value: function infoClear() {
            var _this2 = this;

            this.clearTout = setTimeout(function () {
                _this2.refs.infocache.value = '';
            }, 5000);
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { style: { overflow: 'scroll', margin: '0', maxHeight: "490px", height: '490px' } },
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
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '10%' },
                                'TxHash'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '10%' },
                                'From'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '10%' },
                                'To'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '8%' },
                                'Type'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '8%' },
                                'Amount'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '8%' },
                                'Gas'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '8%' },
                                'Gas Price'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '8%' },
                                'Block No.'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'balance-sheet', style: { color: '#111111' }, width: '8%' },
                                'Status'
                            )
                        ),
                        this.receipts()
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { style: {
                            textAlign: 'center',
                            backgroundColor: '#ffffff',
                            width: '99.5%',
                            maxHeight: '40',
                            minHeight: '40',
                            zIndex: '2',
                            position: "fixed",
                            bottom: '20%',
                            boxShadow: '0 -5px 6px -5px rgba(200,200,200,0.5)'
                        } },
                    _react2.default.createElement('input', { type: 'text', style: { paddingTop: '5px', fontFamily: 'monospace', border: 0, width: '85%', fontSize: '1.11em', textAlign: 'center' }, align: 'center', ref: 'infocache', value: '' })
                )
            );
        }
    }]);

    return Receipts;
}(_reflux2.default.Component);

exports.default = Receipts;