"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CastIronStore = require("../store/CastIronStore");

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _CastIronService = require("../service/CastIronService");

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _CastIronActions = require("../action/CastIronActions");

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _BlockTimer = require("../util/BlockTimer");

var _BlockTimer2 = _interopRequireDefault(_BlockTimer);

var _dns = require("dns");

var _Sell = require("./Sell");

var _Sell2 = _interopRequireDefault(_Sell);

var _AlertModalUser2 = require("../common/AlertModalUser");

var _AlertModalUser3 = _interopRequireDefault(_AlertModalUser2);

var _AlertModal = require("../components/AlertModal");

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _BMartService = require("../service/BMartService");

var _BMartService2 = _interopRequireDefault(_BMartService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trade = function (_AlertModalUser) {
    _inherits(Trade, _AlertModalUser);

    function Trade(props) {
        _classCallCheck(this, Trade);

        var _this = _possibleConstructorReturn(this, (Trade.__proto__ || Object.getPrototypeOf(Trade)).call(this, props));

        _this.buy = function (order) {

            var posAddr = order.addr;
            var price = _this.wallet.toWei(order.price, _this.wallet.TokenList["ETH"].decimals);
            var buyAmount = _this.state.buyAmount[order.addr];console.log("Buy amount is " + buyAmount);
            var payment = price.times(buyAmount); // 10 tokens
            var total = payment.times(1.0025);
            var tokenAddr = _this.wallet.TokenList[_this.state.selected_token_name].addr;
            var buyAmountInUnit = _this.wallet.toWei(buyAmount, _this.wallet.TokenList[_this.state.selected_token_name].decimals).toString();

            var tk = {
                type: 'BMart',
                contract: 'ETHMall',
                call: 'buyProxy',
                args: ['posims', 'token', 'amount'],
                txObj: { value: total.toString(), gas: 2200000 },
                tkObj: {
                    posims: posAddr,
                    token: tokenAddr,
                    amount: buyAmountInUnit
                }
            };

            _CastIronActions2.default.sendTk(tk);
        };

        _this.sellOrBuy = function () {
            var isSell = !_this.state.isSell;
            _this.setState({ isSell: isSell });
        };

        _this.show = function (index) {
            _this.setState({ showIndex: index });
        };

        _this.hide = function (index) {
            _this.setState({ showIndex: null });
        };

        _this.readOrders = function () {
            var TKRAddr = _this.wallet.TokenList[_this.state.selected_token_name].addr;
            var TKRdecimal = _this.wallet.TokenList[_this.state.selected_token_name].decimals;
            return _this.Registry.browseStock(TKRAddr, 1, 1000).map(function (rawOrder) {
                return {
                    addr: _this.wallet.byte32ToAddress(rawOrder[0]),
                    amount: Number(_this.wallet.toEth(rawOrder[1], _this.wallet.TokenList[_this.state.selected_token_name].decimals).toFixed(9)),
                    price: Number(_this.wallet.toEth(rawOrder[2], _this.wallet.TokenList["ETH"].decimals).toFixed(9))
                };
            });
        };

        _this.refreshOrders = function () {
            _this.setState({
                orders: _this.readOrders()
            });
        };

        _this.updateAmount = function (posims, event) {
            var value = event.target.value;
            if (isNaN(value)) {
                _this.openModal("Please enter a number!");
                event.target.value = value.slice(0, -1);
            } else {
                console.log("updateAmount: got amount " + event.target.value);
                _this.setState({ buyAmount: _extends({}, _this.state.buyAmount, _defineProperty({}, posims, event.target.value)) });
            }
        };

        _this.orders = function () {
            if (_this.state.orders) {
                _this.sortOrders();
                return _this.state.buckets.map(function (bucket) {
                    if (bucket.index == _this.state.showIndex) {
                        return _react2.default.createElement(
                            "table",
                            { border: "0" },
                            _react2.default.createElement(
                                "tbody",
                                null,
                                _react2.default.createElement(
                                    "tr",
                                    { className: "avatar", style: { padding: '3px' } },
                                    _react2.default.createElement(
                                        "td",
                                        { className: "avatar", style: { padding: '3px' }, width: "49%" },
                                        bucket.price
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        { className: "avatar", style: { padding: '3px' }, width: "26%" },
                                        bucket.amount
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        { className: "avatar", style: { padding: '3px', minWidth: '310px' }, colSpan: "2" },
                                        " ",
                                        _react2.default.createElement("input", { type: "button", className: "button", value: "Hide Stores",
                                            onClick: _this.hide.bind(_this, bucket.index) })
                                    )
                                ),
                                _this.state.orders.slice(bucket.start, bucket.end + 1).map(function (order) {
                                    if (order.addr == _this.ETHMall.getStoreInfo(_this.state.address)[0]) {
                                        return _react2.default.createElement(
                                            "tr",
                                            { className: "balance-sheet", style: { padding: '3px' } },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { padding: '3px' }, width: "49%" },
                                                order.price
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { padding: '3px' }, width: "26%" },
                                                order.amount
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { paddingLeft: '3px', paddingRight: '3px', paddingTop: '10px', paddingBottom: '10px', minWidth: '310px' }, colSpan: "2" },
                                                _react2.default.createElement(
                                                    "label",
                                                    { style: { padding: '4px' } },
                                                    "Your Order"
                                                )
                                            )
                                        );
                                    } else {
                                        return _react2.default.createElement(
                                            "tr",
                                            { className: "balance-sheet", style: { padding: '3px' } },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { padding: '3px' }, width: "49%" },
                                                order.price
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { padding: '3px' }, width: "26%" },
                                                order.amount
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { padding: '1px', minWidth: '156px' } },
                                                _react2.default.createElement("input", { placeholder: "Input Amount", type: "text", size: "10",
                                                    onChange: _this.updateAmount.bind(_this, order.addr),
                                                    style: { textAlign: 'center', paddingLeft: "3px", paddingRight: "3px" } })
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "balance-sheet", style: { padding: '1px', minWidth: '155px' } },
                                                _react2.default.createElement("input", { type: "button", className: "bbutton", value: "Buy",
                                                    onClick: _this.buy.bind(_this, order) })
                                            )
                                        );
                                    }
                                })
                            )
                        );
                    } else if (_this.state.showIndex !== null) {
                        return _react2.default.createElement(
                            "table",
                            { border: "0" },
                            _react2.default.createElement(
                                "tbody",
                                null,
                                _react2.default.createElement(
                                    "tr",
                                    { className: "bucket-table", style: { textAlign: 'center' } },
                                    _react2.default.createElement(
                                        "td",
                                        { className: "bucket-table", width: "49%", style: { textAlign: 'center' } },
                                        bucket.price
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        { className: "bucket-table", width: "26%", style: { textAlign: 'center' } },
                                        bucket.amount
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        { className: "bucket-table", style: { minWidth: '310px', textAlign: 'center' }, colSpan: "2" },
                                        _react2.default.createElement("input", { type: "button", className: "tbutton", value: "Show Stores",
                                            onClick: _this.show.bind(_this, bucket.index) })
                                    )
                                ),
                                " "
                            )
                        );
                    } else {
                        return _react2.default.createElement(
                            "table",
                            { border: "0" },
                            _react2.default.createElement(
                                "tbody",
                                null,
                                _react2.default.createElement(
                                    "tr",
                                    { className: "bucket-table-init", style: { textAlign: 'center' } },
                                    _react2.default.createElement(
                                        "td",
                                        { className: "bucket-table-init", width: "49%", style: { textAlign: 'center' } },
                                        bucket.price
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        { className: "bucket-table-init", width: "26%", style: { textAlign: 'center' } },
                                        bucket.amount
                                    ),
                                    _react2.default.createElement(
                                        "td",
                                        { className: "bucket-table-init", style: { minWidth: '310px', textAlign: 'center' }, colSpan: "2" },
                                        _react2.default.createElement("input", { type: "button", className: "tbutton", value: "Show Stores",
                                            onClick: _this.show.bind(_this, bucket.index) })
                                    )
                                ),
                                " "
                            )
                        );
                    }
                });
            }
        };

        _this.store = _CastIronStore2.default;
        _this.wallet = _CastIronService2.default.wallet;
        _this.state = {
            buckets: [],
            showIndex: null,
            buyAmount: {},
            isSell: false
        };

        _this.storeKeys = ["selected_token_name", 'address', 'alertContent', 'isAlertModalOpen'];

        _this.ETHMall = _BMartService2.default.ETHMall;
        _this.Registry = _BMartService2.default.Registry;

        return _this;
    }

    _createClass(Trade, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            _get(Trade.prototype.__proto__ || Object.getPrototypeOf(Trade.prototype), "componentWillMount", this).call(this);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.setState({ orders: this.readOrders() });
            console.log("in componet did mount in Trade.js");
            _BlockTimer2.default.register(this.refreshOrders);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            _get(Trade.prototype.__proto__ || Object.getPrototypeOf(Trade.prototype), "componentWillUnmount", this).call(this);
            _BlockTimer2.default.unRegister(this.refreshOrders);
        }
    }, {
        key: "sortOrders",
        value: function sortOrders() {
            this.state.orders.sort(function (a, b) {
                // TODO: in future if the price are the same we may want to sort by created time of the store
                return a.price > b.price ? 1 : a.price == b.price ? a.addr > b.addr ? 1 : -1 : -1;
            });

            var arr = Array.from(Array(11).keys());
            var orders = this.state.orders;
            var a = Math.floor(orders.length / 11);
            var b = orders.length % 11;

            this.state.buckets = arr.map(function (i) {
                var start = void 0,
                    end = void 0;
                if (i < b) {
                    start = i * (a + 1);
                    end = start + a;
                } else {
                    start = i * (a + 1) - (i - b);
                    end = start + a - 1;
                }
                var amount = orders.slice(start, end + 1).map(function (o) {
                    return o.amount;
                }).reduce(function (a, b) {
                    return a + b;
                });
                return { price: orders[start].price.toFixed(9) + " ~ " + orders[end].price.toFixed(9), amount: amount, start: start, end: end, index: i };
            });
        }
    }, {
        key: "render",
        value: function render() {
            console.log("in Trade render()");
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "table",
                    { className: "balance-sheet" },
                    _react2.default.createElement(
                        "tbody",
                        null,
                        _react2.default.createElement(
                            "tr",
                            { className: "avatar", style: { textAlign: "center" } },
                            _react2.default.createElement(
                                "th",
                                { className: "balance-sheet", colSpan: "2" },
                                "ETH - " + this.state.selected_token_name
                            ),
                            _react2.default.createElement(
                                "th",
                                { className: "balance-sheet", style: { color: '#111111' }, width: "316px" },
                                _react2.default.createElement("input", { type: "button", className: "button", value: this.state.isSell ? "Buy" : "Sell",
                                    onClick: this.sellOrBuy })
                            )
                        )
                    )
                ),
                this.state.isSell ? _react2.default.createElement(_Sell2.default, { canvas: this.props.canvas }) : _react2.default.createElement(
                    "div",
                    { style: { width: '100%', overflow: 'scroll', margin: '0', maxHeight: "580px", height: '580px' } },
                    _react2.default.createElement(
                        "table",
                        { className: "balance-sheet" },
                        _react2.default.createElement(
                            "tbody",
                            null,
                            _react2.default.createElement(
                                "tr",
                                { className: "balance-sheet" },
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "816px" },
                                    "Price"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "417px" },
                                    "Amount"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "425px" },
                                    "Action"
                                )
                            ),
                            _react2.default.createElement(
                                "tr",
                                null,
                                _react2.default.createElement(
                                    "td",
                                    { colSpan: "3", style: { paddingTop: "16px", paddingBottom: "16px" } },
                                    this.orders()
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(_AlertModal2.default, { content: this.state.alertContent, isAlertModalOpen: this.state.isAlertModalOpen, close: this.closeModal })
            );
        }
    }]);

    return Trade;
}(_AlertModalUser3.default);

exports.default = Trade;