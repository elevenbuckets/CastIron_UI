'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var BlockTimer = function BlockTimer() {
    var _this = this;

    _classCallCheck(this, BlockTimer);

    this.initialize = function () {
        var netStatus = _this.wallet.ethNetStatus();
        _this.state.blockHeight = netStatus.blockHeight;
        _this.state.blockTime = netStatus.blockTime;
        _this.timer = setInterval(_this.watchAndNotify, 1000);

        _this.register(_this.reportNewBlock);
    };

    this.watchAndNotify = function () {
        var netStatus = _this.wallet.ethNetStatus();
        if (netStatus.blockHeight != _this.state.blockHeight) {
            _this.state.blockHeight = netStatus.blockHeight;
            _this.state.blockTime = netStatus.blockTime;
            _this.notifyObservers();
        }
    };

    this.notifyObservers = function () {
        _this.state.observers.map(function (observer) {
            observer();
        });
    };

    this.register = function (observer) {
        _this.state.observers.push(observer);
    };

    this.unRegister = function (observer) {
        if (_this.state.observers.indexOf(observer) == -1) {
            return;
        }
        _this.state.observers.splice(_this.state.observers.indexOf(observer), 1);
    };

    this.reportNewBlock = function () {
        console.log("Block Height from reportNewBlock is " + _this.state.blockHeight);
    };

    this.wallet = _CastIronService2.default.wallet;
    this.state = {
        blockHeight: null,
        observers: [],
        blockTime: null
    };
    this.initialize();
};

var timer = new BlockTimer();

exports.default = timer;