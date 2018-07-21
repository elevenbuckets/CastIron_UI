'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SchedulerView = require('../dapp_view/SchedulerView');

var _SchedulerView2 = _interopRequireDefault(_SchedulerView);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DappViewService = function () {
    function DappViewService() {
        var _this = this;

        _classCallCheck(this, DappViewService);

        this.getView = function (key) {
            return _this.viewMap[key];
        };

        this.viewMap = {
            Scheduler: _react2.default.createElement(_SchedulerView2.default, null)
        };
    }

    _createClass(DappViewService, [{
        key: 'import',
        value: function _import(dapp) {}
    }]);

    return DappViewService;
}();

var dappViewService = new DappViewService();

exports.default = dappViewService;