'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

var _Constants = require('../util/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reflux components

var Footer = function (_Reflux$Component) {
    _inherits(Footer, _Reflux$Component);

    function Footer(props) {
        _classCallCheck(this, Footer);

        var _this = _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).call(this, props));

        _this.hasNumberOfPendingReceipts = function () {
            var pendingQs = Object.keys(_this.state.receipts).filter(function (Q) {
                return _this.state.receipts[Q] && _this.state.receipts[Q].length > 0 && _this.hasPendingReceipt(_this.state.receipts[Q]);
            });

            return pendingQs.length;
        };

        _this.getReceiptComponent = function () {
            var n = _this.hasNumberOfPendingReceipts();
            return _react2.default.createElement(
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
                            { style: { border: '0px', width: '480px' } },
                            n > 0 ? _react2.default.createElement('div', { align: 'right', className: 'loader' }) : _react2.default.createElement('div', null)
                        ),
                        _react2.default.createElement(
                            'td',
                            { style: { border: '0px' } },
                            _react2.default.createElement('input', { type: 'button', className: 'button', value: n > 0 ? "Receipts(" + n + ")" : "Receipts", onClick: _this.handleClick })
                        )
                    )
                )
            );
        };

        _this.hasPendingReceipt = function (receipts) {
            for (var i in receipts) {
                if (_this.getStatus(receipts[i]) == _Constants2.default.Pending) {
                    return true;
                }
            }
            return false;
        };

        _this.render = function () {

            var dashInfo = "BlockHeight: " + _this.state.blockHeight + "  &nbsp Unix Time(Local Time) :" + _this.state.unixTime + "(" + _this.state.localTime + ") BlockTimeStamp: " + _this.state.blockTime + " GasPrice: " + _this.state.gasPrice;

            return _react2.default.createElement(
                'table',
                { className: 'Footer', style: { padding: '0px', margin: '0px', minWidth: '1280px', boxShadow: "rgb(10, 10, 10) 0px 26px 24px" } },
                _react2.default.createElement(
                    'tbody',
                    null,
                    _react2.default.createElement(
                        'tr',
                        { style: { paddingTop: '0px', paddingBottom: '0px' } },
                        _react2.default.createElement(
                            'th',
                            { style: { paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' } },
                            _react2.default.createElement(
                                'dl',
                                { style: { paddingTop: '0px', paddingBottom: '0px' } },
                                _react2.default.createElement(
                                    'dt',
                                    null,
                                    'BlockHeight:'
                                ),
                                _react2.default.createElement(
                                    'dd',
                                    null,
                                    _this.state.blockHeight
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'th',
                            { style: { paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' } },
                            _react2.default.createElement(
                                'dl',
                                { style: { paddingTop: '0px', paddingBottom: '0px' } },
                                _react2.default.createElement(
                                    'dt',
                                    null,
                                    'Unix Time:'
                                ),
                                _react2.default.createElement(
                                    'dd',
                                    null,
                                    Math.floor(_this.state.unixTime)
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'th',
                            { style: { paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' } },
                            _react2.default.createElement(
                                'dl',
                                { style: { paddingTop: '0px', paddingBottom: '0px' } },
                                _react2.default.createElement(
                                    'dt',
                                    null,
                                    'Local Time:'
                                ),
                                _react2.default.createElement(
                                    'dd',
                                    null,
                                    String(_this.state.localTime).substring(0, 24)
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'th',
                            { style: { paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' } },
                            _react2.default.createElement(
                                'dl',
                                { style: { paddingTop: '0px', paddingBottom: '0px' } },
                                _react2.default.createElement(
                                    'dt',
                                    null,
                                    'BlockTimeStamp:'
                                ),
                                _react2.default.createElement(
                                    'dd',
                                    null,
                                    _this.state.blockTime
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'th',
                            { style: { paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' } },
                            _react2.default.createElement(
                                'dl',
                                { style: { paddingTop: '0px', paddingBottom: '0px' } },
                                _react2.default.createElement(
                                    'dt',
                                    null,
                                    'GasPrice:'
                                ),
                                _react2.default.createElement(
                                    'dd',
                                    null,
                                    _this.state.gasPrice
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'th',
                            { style: { paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' } },
                            _react2.default.createElement('input', { type: 'button', className: 'dbutton', onClick: _this.props.handleDrawer, value: 'Drawer', style: { border: "0px", color: "white" } })
                        ),
                        _react2.default.createElement(
                            'th',
                            { width: '99%', style: { textAlign: 'right', paddingTop: '0px', paddingBottom: '0px' } },
                            _this.getReceiptComponent()
                        )
                    )
                )
            );
        };

        _this.store = _CastIronStore2.default;
        _this.wallet = _CastIronService2.default.wallet;

        _this.state = {
            unixTime: 123213,
            localTime: null,
            defaultGasPrice: 20
        };

        _this.getDashInfo = _this.getDashInfo.bind(_this);
        return _this;
    }

    _createClass(Footer, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            _get(Footer.prototype.__proto__ || Object.getPrototypeOf(Footer.prototype), 'componentWillMount', this).call(this);
            this.getDashInfo();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.timer = setInterval(this.getDashInfo, 1000);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _get(Footer.prototype.__proto__ || Object.getPrototypeOf(Footer.prototype), 'componentWillUnmount', this).call(this);
            clearInterval(this.timer);
        }
    }, {
        key: 'getDashInfo',
        value: function getDashInfo() {
            this.setState(function () {
                return { localTime: new Date(), unixTime: Date.now() / 1000 };
            });

            // let netStatus = this.wallet.ethNetStatus();
            // if (netStatus.blockHeight != this.state.blockHeight) {
            //     CastIronActions.infoUpdate(netStatus.blockHeight, netStatus.blockTime)
            // }
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
        key: 'handleClick',
        value: function handleClick() {
            _CastIronActions2.default.changeView("Receipts");
        }
    }]);

    return Footer;
}(_reflux2.default.Component);

exports.default = Footer;