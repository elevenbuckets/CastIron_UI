"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DappViewService = function () {
    function DappViewService() {
        var _this = this;

        _classCallCheck(this, DappViewService);

        this.getView = function (key) {
            return _this.viewMap[key];
        };

        this.viewMap = {};

        var dapps = { "Schedular": "SchedulerView" };

        Object.keys(dapps).map(function (key) {
            var ppath = "../../dapps/" + key + "/public/view/" + dapps[key];
            Promise.resolve().then(function () {
                return _interopRequireWildcard(require("" + ppath));
            }).then(function (View) {
                console.log("view is : ");
                console.log(View);
                _this.viewMap[key] = _react2.default.createElement(View.default, null);
            });
        });
    }

    _createClass(DappViewService, [{
        key: "import",
        value: function _import(dapp) {}
    }]);

    return DappViewService;
}();

var dappViewService = new DappViewService();

exports.default = dappViewService;