"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CastIronStore = require("../store/CastIronStore");

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _CastIronService = require("../service/CastIronService");

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDropdown = require("react-dropdown");

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _CastIronActions = require("../action/CastIronActions");

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _TxObjects = require("../view/TxObjects");

var _TxObjects2 = _interopRequireDefault(_TxObjects);

var _ScheduleTxQList = require("./ScheduleTxQList");

var _ScheduleTxQList2 = _interopRequireDefault(_ScheduleTxQList);

var _Utils = require("../util/Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SchedulerJob = function (_Reflux$Component) {
    _inherits(SchedulerJob, _Reflux$Component);

    function SchedulerJob(props) {
        _classCallCheck(this, SchedulerJob);

        var _this = _possibleConstructorReturn(this, (SchedulerJob.__proto__ || Object.getPrototypeOf(SchedulerJob)).call(this, props));

        _this.handleSchedule = function (addr, type, amount, gasNumber) {
            _CastIronActions2.default.schedule(_this.state.address, addr, type, amount, gasNumber);
        };

        _this.handleChange = function (event) {
            var addr = event.target.value;
            console.log('got addr: ' + addr);
            try {
                if (_CastIronService2.default.wallet.web3.isAddress(addr) === true && (_CastIronService2.default.wallet.web3.toAddress(addr) == addr || _CastIronService2.default.wallet.web3.toChecksumAddress(addr) == addr)) {
                    addr = _CastIronService2.default.wallet.web3.toAddress(addr);
                    (0, _Utils.createCanvasWithAddress)(_this.refs.canvas, addr);
                } else {
                    _this.refs.canvas.getContext('2d').clearRect(0, 0, _this.refs.canvas.width, _this.refs.canvas.height);
                }
            } catch (err) {
                _this.refs.canvas.getContext('2d').clearRect(0, 0, _this.refs.canvas.width, _this.refs.canvas.height);
            }

            (0, _Utils.setDappLocalState)(_this, { recipient: addr });
        };

        _this.back = function () {
            _this.props.goTo("List");
            if (_this.props.viewType == "Edit") {
                _this.props.cleanEdit();
            }
        };

        _this.render = function () {
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
                                { colSpan: "2", className: "avatar", style: { textAlign: "center" } },
                                "Schedular"
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet" },
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet" },
                                _react2.default.createElement(
                                    "label",
                                    null,
                                    "Recipient:",
                                    _react2.default.createElement("input", { size: 62, style: { marginLeft: '30', fontFamily: 'monospace', fontSize: '1.09em' }, type: "text",
                                        onChange: _this.handleChange, value: _this.state.dappLocal.recipient, placeholder: "Ethereum Address" })
                                )
                            ),
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet", width: 211, rowSpan: "2", style: { backgroundColor: '#eeeeee' } },
                                _react2.default.createElement(
                                    "table",
                                    { className: "txform" },
                                    _react2.default.createElement(
                                        "tbody",
                                        null,
                                        _react2.default.createElement(
                                            "tr",
                                            { className: "txform" },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform", style: { textAlign: 'center' } },
                                                _react2.default.createElement("canvas", { ref: "canvas", width: 66, height: 66, style: {
                                                        border: "3px solid #ccc",
                                                        borderBottomLeftRadius: "2.8em",
                                                        borderBottomRightRadius: "2.8em",
                                                        borderTopRightRadius: "2.8em",
                                                        borderTopLeftRadius: "2.8em"
                                                    }
                                                })
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet" },
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet" },
                                _react2.default.createElement(_TxObjects2.default, { selected_token_name: _this.state.selected_token_name,
                                    handleEnqueue: _this.handleEnqueueSchedule, handleSend: _this.handleSchedule,
                                    recipient: _this.state.dappLocal.recipient, send_button_value: "Schedule" })
                            )
                        )
                    )
                ),
                _react2.default.createElement(_ScheduleTxQList2.default, { style: { marginTop: '0', marginBottom: '0', paddingTop: '0', paddingBottom: '0' } }),
                _react2.default.createElement(
                    "div",
                    { style: {
                            textAlign: 'center',
                            backgroundColor: '#ffffff',
                            width: '100%',
                            maxHeight: '58',
                            minHeight: '58',
                            zIndex: '1',
                            position: "fixed",
                            bottom: '20%',
                            boxShadow: '0 -5px 6px -5px rgba(200,200,200,0.5)'
                        } },
                    _react2.default.createElement("input", { type: "button", className: "button", value: "BatchSchedule", onClick: _this.handleBatchSchedule, style: { width: '160px', marginTop: '19px', marginLeft: '5%', marginRight: '5%' } }),
                    _react2.default.createElement("input", { type: "button", className: "button", value: "ClearAll", onClick: _this.handleClearQueue, style: { backgroundColor: 'rgb(250,0,0)', width: '160px', marginTop: '19px', marginLeft: '5%', marginRight: '5%' } }),
                    _react2.default.createElement("input", { type: "button", className: "button", value: "Back", onClick: _this.back, style: { width: '160px', marginTop: '19px', marginLeft: '5%', marginRight: '5%' } })
                )
            );
        };

        _this.store = _CastIronStore2.default;
        _this.state = {
            dappLocal: {
                recipient: ''
            }
        };
        _this.wallet = _CastIronService2.default.wallet;
        _this.timeout;
        return _this;
    }

    _createClass(SchedulerJob, [{
        key: "handleEnqueueSchedule",
        value: function handleEnqueueSchedule(tx) {
            _CastIronActions2.default.enqueueSchedule(tx);
        }
    }, {
        key: "handleDequeueSchedule",
        value: function handleDequeueSchedule(tx) {
            _CastIronActions2.default.dequeueScheudle(tx);
        }
    }, {
        key: "handleClearQueueSchedule",
        value: function handleClearQueueSchedule() {
            _CastIronActions2.default.clearQueueschedule();
        }
    }, {
        key: "handleBatchSchedule",
        value: function handleBatchSchedule() {
            _CastIronActions2.default.batchSchedule();
        }
    }]);

    return SchedulerJob;
}(_reflux2.default.Component);

exports.default = SchedulerJob;