'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CastIron = require('CastIron/core/CastIron');

var _CastIron2 = _interopRequireDefault(_CastIron);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CastIronService = function () {
    function CastIronService() {
        _classCallCheck(this, CastIronService);

        var __pkgdir = _path2.default.join('dapps', 'BMart');
        var __abidir = _path2.default.join(__pkgdir, 'ABI');
        var __condir = _path2.default.join(__pkgdir, 'conditions');

        var abiPath = function abiPath(ctrName) {
            return _path2.default.join(__abidir, ctrName + '.json');
        };
        var condPath = function condPath(ctrName, condName) {
            return _path2.default.join(__condir, ctrName, condName + '.json');
        };
        // dApp specific info
        var __APP__ = 'BMart';

        this.wallet = new _CastIron2.default('.local/config.json');
        // CastIron ABI + conditions loader
        this.wallet.newApp(__APP__)('0.2', 'ETHMall', abiPath('ETHMall'), { 'Sanity': condPath('ETHMall', 'Sanity') });
        this.wallet.newApp(__APP__)('0.2', 'Registry', abiPath('Registry'), { 'Sanity': condPath('Registry', 'Sanity') });

        this.ETHMall = this.wallet.CUE[__APP__]['ETHMall'];
        this.Registry = this.wallet.CUE[__APP__]['Registry'];

        this.getAccounts = this.getAccounts.bind(this);
        this.state = {
            currentQs: []
        };
        this.addQ = this.addQ.bind(this);
        this.deleteQ = this.deleteQ.bind(this);
        this.clearQ = this.clearQ.bind(this);
    }

    _createClass(CastIronService, [{
        key: 'getAccounts',
        value: function getAccounts() {
            return this.wallet.allAccounts();
        }
    }, {
        key: 'addQ',
        value: function addQ(Q) {
            this.state.currentQs.push(Q);
        }
    }, {
        key: 'deleteQ',
        value: function deleteQ(Q) {
            this.state.currentQs.splice(this.state.currentQs(Q), 1);
        }
    }, {
        key: 'clearQ',
        value: function clearQ() {
            this.state.currentQs = [];
        }
    }]);

    return CastIronService;
}();

var castIronService = new CastIronService();

exports.default = castIronService;