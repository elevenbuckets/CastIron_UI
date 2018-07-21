"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _Constants = require("../util/Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _BlockTimer = require("../util/BlockTimer");

var _BlockTimer2 = _interopRequireDefault(_BlockTimer);

var _SellOrder = require("../components/SellOrder");

var _SellOrder2 = _interopRequireDefault(_SellOrder);

var _SellShop = require("../components/SellShop");

var _SellShop2 = _interopRequireDefault(_SellShop);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _AlertModal = require("../components/AlertModal");

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _AlertModalUser2 = require("../common/AlertModalUser");

var _AlertModalUser3 = _interopRequireDefault(_AlertModalUser2);

var _BMartService = require("../service/BMartService");

var _BMartService2 = _interopRequireDefault(_BMartService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sell = function (_AlertModalUser) {
    _inherits(Sell, _AlertModalUser);

    function Sell(props) {
        _classCallCheck(this, Sell);

        var _this = _possibleConstructorReturn(this, (Sell.__proto__ || Object.getPrototypeOf(Sell)).call(this, props));

        _this.watchShopInfo = function () {
            _this.shopAddr = _this.ETHMall.getStoreInfo(_this.state.address)[0];
            // CastIron ABI + conditions loader
            _BMartService2.default.generateNewPoSIMSApp(_this.state.address, _this.shopAddr);
            var PoSIMS = _BMartService2.default.getPoSIMS(_this.state.address);

            // has store
            if (typeof PoSIMS != 'undefined') {
                var totalitems = Number(PoSIMS.totalitems().toString());

                if (totalitems > 0) {
                    // has store; has order.
                    var tokenAddr = _this.wallet.TokenList[_this.state.selected_token_name].addr;
                    var orderInfo = PoSIMS.getCatalog();
                    var orders = orderInfo.filter(function (c) {
                        return _this.wallet.byte32ToAddress(c[1]) == tokenAddr;
                    });
                    var orderID = _this.wallet.byte32ToDecimal(orders[0][0]);
                    var sellOrder = PoSIMS.getProductInfo(orderID);

                    _this.setState({
                        sellOrder: {
                            amount: _this.wallet.toEth(sellOrder[1], _this.wallet.TokenList[_this.state.selected_token_name].decimals).toFixed(6),
                            price: _this.wallet.toEth(sellOrder[2], _this.wallet.TokenList[_Constants2.default.ETH].decimals).toFixed(6)
                        }
                    });
                    _this.getShopDeposit(_this.shopAddr, PoSIMS);
                } else if (totalitems == 0) {
                    // has store; no order.
                    _this.setState({
                        sellOrder: {
                            amount: Number(0).toFixed(6),
                            price: Number(0).toFixed(6)
                        }
                    });
                    _this.getShopDeposit(_this.shopAddr, PoSIMS);
                }
            } else {
                // closed store.
                // reset
                _this.setState({
                    sellOrder: null,
                    shopDeposit: 0,
                    shopBalance: 0,
                    canTakeSD: false,
                    paidback: false,
                    totalTake: 0,
                    totalitems: 0
                });
            }
        };

        _this.getShopDeposit = function (shopAddr, posims) {
            var p = posims.paid();
            var d = Number(_this.wallet.toEth(posims.deposit(), 18).toString());
            var t = Number(_this.wallet.toEth(_this.wallet.web3.eth.getBalance(shopAddr), 18).toString());
            var c = _this.ETHMall.isExpired(shopAddr);
            var e = void 0;
            var s = posims.totalitems();

            if (p === false) {
                c === true ? e = t : e = t - d;
            } else {
                e = t;
            }

            _this.setState({
                shopDeposit: d,
                shopBalance: t,
                canTakeSD: c,
                paidback: p,
                totalTake: e,
                totalitems: Number(s.toString())
            });
        };

        _this.getShopAddrs = function () {

            var shopAddrs = Object.keys(_this.state.accounts).map(function (addr) {
                return _this.ETHMall.getStoreInfo(addr)[0] == '0x' ? null : addr;
            }).filter(function (value) {
                return value !== null;
            });

            _this.setState({ shopAddrs: shopAddrs });
            return shopAddrs;
        };

        _this.getEstimateDeposit = function () {
            _this.setState({
                estimateDeposit: _CastIronService2.default.wallet.toEth(_this.ETHMall.getSecureDeposit(), _CastIronService2.default.wallet.TokenList[_Constants2.default.ETH].decimals).toFixed(6)
            });
        };

        _this.handleChangeAmount = function (event) {

            var value = event.target.value;
            if (isNaN(value)) {
                _this.openModal("Please enter a number!");
                event.target.value = value.slice(0, -1);
            } else {
                console.log('got event: ' + event.target.value);
                var amount = event.target.value;
                console.log('got amount: ' + amount);
                _this.setState({ amount: amount });
            }
        };

        _this.handleChangePrice = function (event) {

            var value = event.target.value;
            if (isNaN(value)) {
                _this.openModal("Please enter a number!");
                event.target.value = value.slice(0, -1);
            } else {
                console.log('got event: ' + event.target.value);
                var price = event.target.value;
                console.log('got price: ' + price);
                _this.setState({ price: price });
            }
        };

        _this.createStore = function () {

            var tk = {
                type: 'BMart',
                contract: 'ETHMall',
                call: 'NewStoreFront',
                args: [],
                txObj: { value: _this.ETHMall.getSecureDeposit(), gas: 2200000 },
                tkObj: {}
            };

            _CastIronActions2.default.sendTk(tk);
        };

        _this.createOrder = function () {

            var tk1 = {
                type: 'Token',
                contract: _this.state.selected_token_name,
                call: 'approve',
                args: ['spender', 'amount'],
                txObj: { value: null, gas: 250000 },
                tkObj: {
                    spender: _this.shopAddr,
                    amount: _this.wallet.toWei(_this.state.amount, _this.wallet.TokenList[_this.state.selected_token_name].decimals).toString()
                }
            };

            var tk2 = {
                type: 'BMart',
                contract: "PoSIMS" + _this.state.address,
                call: 'addProductInfo',
                args: ['token', 'amount', 'price'],
                txObj: { value: null, gas: 250000 },
                tkObj: {
                    token: _this.wallet.TokenList[_this.state.selected_token_name].addr,
                    amount: _this.wallet.toWei(_this.state.amount, _this.wallet.TokenList[_this.state.selected_token_name].decimals).toString(),
                    price: _this.wallet.toWei(_this.state.price, _this.wallet.TokenList[_Constants2.default.ETH].decimals).toString()
                }
            };

            _CastIronActions2.default.sendTks([tk1, tk2]);
        };

        _this.cancelOrder = function () {
            var tk = {
                type: 'BMart',
                contract: "PoSIMS" + _this.state.address,
                call: 'delistProduct',
                args: ['id'],
                txObj: { value: null, gas: 250000 },
                tkObj: {
                    id: 1
                }
            };
            _CastIronActions2.default.sendTk(tk);
        };

        _this.changePrice = function () {
            var tk = {
                type: 'BMart',
                contract: "PoSIMS" + _this.state.address,
                call: 'changePrice',
                args: ['token', 'price'],
                txObj: { value: null, gas: 250000 },
                tkObj: {
                    token: _this.wallet.TokenList[_this.state.selected_token_name].addr,
                    price: _this.wallet.toWei(_this.state.price, _this.wallet.TokenList[_Constants2.default.ETH].decimals).toString()
                }
            };
            _CastIronActions2.default.sendTk(tk);
        };

        _this.withdraw = function () {
            var tk = {
                type: 'BMart',
                contract: "PoSIMS" + _this.state.address,
                call: 'withdraw',
                args: [],
                txObj: { value: null, gas: 250000 },
                tkObj: {}
            };
            _CastIronActions2.default.sendTk(tk);
        };

        _this.restock = function () {
            _CastIronActions2.default.send(_this.state.address, _this.shopAddr, _this.state.selected_token_name, _this.state.amount, 150000);
        };

        _this.useOtherStore = function (event) {
            var stage = Promise.resolve(_CastIronActions2.default.addressUpdate(event.value, _this.props.canvas));
            stage.then(function () {
                _this.watchShopInfo();
            });
        };

        _this.store = _CastIronStore2.default;
        _this.wallet = _CastIronService2.default.wallet;
        _this.shopAddr = '0x';

        _this.state = {
            estimateDeposit: null,
            sellOrder: null,
            price: 0,
            amount: 0,
            shopDeposit: 0,
            shopBalance: 0,
            paidback: false,
            canTakeSD: false,
            totalTake: 0,
            totalitems: 0
        };

        _this.storeKeys = ['address', 'selected_token_name', 'accounts', 'alertContent', 'isAlertModalOpen'];
        _this.ETHMall = _BMartService2.default.ETHMall;
        return _this;
    }

    _createClass(Sell, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            _get(Sell.prototype.__proto__ || Object.getPrototypeOf(Sell.prototype), "componentWillMount", this).call(this);
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            if (this.state.address !== prevState.address) {
                this.watchShopInfo();
                this.getEstimateDeposit();
                this.getShopAddrs();
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            console.log("in componet did mount in Sell.js");
            this.shopAddr = this.ETHMall.getStoreInfo(this.state.address)[0];
            //this.getShopAddr();
            this.watchShopInfo();
            this.getEstimateDeposit();
            this.getShopAddrs();
            _BlockTimer2.default.register(this.getEstimateDeposit);
            _BlockTimer2.default.register(this.getShopAddrs);
            _BlockTimer2.default.register(this.watchShopInfo);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            _get(Sell.prototype.__proto__ || Object.getPrototypeOf(Sell.prototype), "componentWillUnmount", this).call(this);
            _BlockTimer2.default.unRegister(this.getEstimateDeposit);
            _BlockTimer2.default.unRegister(this.getShopAddrs);
            _BlockTimer2.default.unRegister(this.watchShopInfo);
        }
    }, {
        key: "render",
        value: function render() {
            console.log("in Sell render()");
            return _react2.default.createElement(
                "div",
                { style: { width: '100%', overflow: 'scroll', margin: '0', maxHeight: "593px", height: '593px' } },
                _react2.default.createElement(
                    "table",
                    { className: "balance-sheet" },
                    _react2.default.createElement(
                        "tbody",
                        null,
                        _react2.default.createElement(
                            "tr",
                            { className: "bucket-table-init" },
                            _react2.default.createElement(
                                "td",
                                { className: "bucket-table-init" },
                                _react2.default.createElement(_SellShop2.default, { createStore: this.createStore, disableCreateStore: this.shopAddr != "0x",
                                    estimateDeposit: this.state.estimateDeposit, shopAddrs: this.state.shopAddrs, sellOrder: this.state.sellOrder,
                                    shopAddr: this.shopAddr, shopDeposit: this.state.shopDeposit, shopBalance: this.state.shopBalance,
                                    address: this.state.address, useOtherStore: this.useOtherStore, paidback: this.state.paidback, totalOrders: this.state.totalitems,
                                    canTakeSD: this.state.canTakeSD, totalTake: this.state.totalTake, withdraw: this.withdraw })
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "bucket-table-init" },
                            _react2.default.createElement(
                                "td",
                                { className: "bucket-table-init" },
                                _react2.default.createElement(_SellOrder2.default, { sellOrder: this.state.sellOrder, createOrder: this.createOrder,
                                    totalOrders: this.state.totalitems, symbol: this.state.selected_token_name,
                                    decimals: this.wallet.TokenList[this.state.selected_token_name].decimals,
                                    tokenName: this.wallet.TokenList[this.state.selected_token_name].name,
                                    disableCreateOrder: this.shopAddr == "0x" || this.state.sellOrder === null || this.state.totalitems != 0,
                                    disableChangePrice: this.shopAddr == "0x",
                                    disableRestock: this.shopAddr == "0x",
                                    disableCancelOrder: this.shopAddr == "0x",
                                    handleChangeAmount: this.handleChangeAmount,
                                    handleChangePrice: this.handleChangePrice,
                                    changePrice: this.changePrice,
                                    restock: this.restock,
                                    cancelOrder: this.cancelOrder
                                })
                            )
                        )
                    )
                ),
                _react2.default.createElement(_AlertModal2.default, { content: this.state.alertContent, isAlertModalOpen: this.state.isAlertModalOpen, close: this.closeModal })
            );
        }
    }]);

    return Sell;
}(_AlertModalUser3.default);

exports.default = Sell;