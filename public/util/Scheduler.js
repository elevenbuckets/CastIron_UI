'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BlockTimer = require('./BlockTimer');

var _BlockTimer2 = _interopRequireDefault(_BlockTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scheduler = function Scheduler() {
    var _this = this;

    _classCallCheck(this, Scheduler);

    this.runJobs = function () {
        _this.state.Qs.map(function (queue) {
            if (_this.isReadyToRun(_BlockTimer2.default.state.blockHeight, _BlockTimer2.default.state.blockTime, queue)) {
                queue.func.apply(queue, _toConsumableArray(queue.args));
                queue.status = "Executed";
            }
        });
    };

    this.schedule = function (queue) {
        _this.state.Qs.push(queue);
    };

    this.deleteQ = function (Q) {
        if (_this.state.Qs.indexOf(Q) != -1) {
            _this.state.Qs.splice(_this.state.Qs.indexOf(Q), 1);
        }
    };

    this.deleteQs = function (Qs) {
        Qs.map(function (Q) {
            _this.deleteQ(Q);
        });
    };

    this.isReadyToRun = function (blockHeight, blockTime, queue) {
        if (queue.status == "Executed") {
            return false;
        } else if (queue.trigger == "BlockHeight") {
            return blockHeight >= parseInt(queue.target) && blockHeight <= parseInt(queue.target) + parseInt(queue.tolerance);
        } else if (queue.trigger == "BlockTime") {
            return blockTime >= queue.target && blockTime <= queue.target + queue.tolerance;
        }
    };

    this.state = {
        Qs: []
    };

    _BlockTimer2.default.register(this.runJobs);
};

var scheduler = new Scheduler();

exports.default = scheduler;