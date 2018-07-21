'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Accounts = require('accMgr/Accounts');

var _Accounts2 = _interopRequireDefault(_Accounts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AcctMgrService = function AcctMgrService() {
    _classCallCheck(this, AcctMgrService);

    this.accMgr = new _Accounts2.default('.local');
};

var AcctMgrServ = new AcctMgrService();
console.log(AcctMgrServ.accMgr.config);

exports.default = AcctMgrServ;