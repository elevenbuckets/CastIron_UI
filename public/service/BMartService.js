'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _CastIronService = require('./CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// dApp specific info
var __APP__ = 'BMart';
var __pkgdir = _path2.default.join('dapps', __APP__);
var __abidir = _path2.default.join(__pkgdir, 'ABI');
var __condir = _path2.default.join(__pkgdir, 'conditions');

var abiPath = function abiPath(ctrName) {
    return _path2.default.join(__abidir, ctrName + '.json');
};
var condPath = function condPath(ctrName, condName) {
    return _path2.default.join(__condir, ctrName, condName + '.json');
};

var BMartService = function BMartService() {
    var _this = this;

    _classCallCheck(this, BMartService);

    this.getAppName = function () {
        return __APP__;
    };

    this.generateNewPoSIMSApp = function (addr, shopAddr) {
        _this.wallet.newApp(__APP__)('0.2', 'PoSIMS' + addr, abiPath('PoSIMS'), { 'Sanity': condPath('PoSIMS', 'Sanity') }, shopAddr);
    };

    this.getPoSIMS = function (addr) {
        return _this.wallet.CUE[__APP__]['PoSIMS' + addr];
    };

    this.wallet = _CastIronService2.default.wallet;

    // CastIron ABI + conditions loader
    // TODO: for now BMART is only available on privnet
    // In the future we should have package manifest to declare which network IDs a dApp is available, and use that information
    // to build the if statements below! 
    if (this.wallet.networkID === '1100') {
        this.wallet.newApp(__APP__)('0.2', 'ETHMall', abiPath('ETHMall'), { 'Sanity': condPath('ETHMall', 'Sanity') });
        this.wallet.newApp(__APP__)('0.2', 'Registry', abiPath('Registry'), { 'Sanity': condPath('Registry', 'Sanity') });
    } else {
        this.wallet.newApp(__APP__)('0.2', 'ETHMall', abiPath('ETHMall'), { 'Sanity': condPath('ETHMall', 'Sanity') }, this.wallet.web3.toAddress('0x0'));
        this.wallet.newApp(__APP__)('0.2', 'Registry', abiPath('Registry'), { 'Sanity': condPath('Registry', 'Sanity') }, this.wallet.web3.toAddress('0x0'));
    }

    this.ETHMall = this.wallet.CUE[__APP__]['ETHMall'];
    this.Registry = this.wallet.CUE[__APP__]['Registry'];
};

var bmartService = new BMartService();

exports.default = bmartService;