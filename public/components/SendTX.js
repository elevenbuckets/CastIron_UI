'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactToggle = require('react-toggle');

var _reactToggle2 = _interopRequireDefault(_reactToggle);

var _SingleTX = require('./SingleTX');

var _SingleTX2 = _interopRequireDefault(_SingleTX);

var _BatchTXS = require('./BatchTXS');

var _BatchTXS2 = _interopRequireDefault(_BatchTXS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SendTX = function (_React$Component) {
    _inherits(SendTX, _React$Component);

    function SendTX(props) {
        _classCallCheck(this, SendTX);

        var _this = _possibleConstructorReturn(this, (SendTX.__proto__ || Object.getPrototypeOf(SendTX)).call(this, props));

        _this.onFormSubmit = _this.onFormSubmit.bind(_this);
        _this.handleChangePayments = _this.handleChangePayments.bind(_this);

        _this.state = {
            isBatched: false
        };
        return _this;
    }

    _createClass(SendTX, [{
        key: 'onFormSubmit',
        value: function onFormSubmit() {
            e.preventDefault();
            var addr = e.target.elements.addr.value.trim();
            var amount = e.target.elements.amount.value.trim();
            var gasNumber = e.target.elements.gasNumber.value.trim();
            this.props.sendTX(addr, amount);
        }
    }, {
        key: 'handleChangePayments',
        value: function handleChangePayments() {
            this.setState(function (preState) {
                var state = preState;
                state.isBatched = !state.isBatched;
                return state;
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var isBatched = this.state.isBatched;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'label',
                    null,
                    _react2.default.createElement(_reactToggle2.default, {
                        checked: isBatched,
                        onChange: this.handleChangePayments }),
                    _react2.default.createElement(
                        'span',
                        null,
                        'Batched Payments'
                    )
                ),
                isBatched ? _react2.default.createElement(_BatchTXS2.default, { queuedTxs: this.props.queuedTxs,
                    selected_account: this.props.selected_account,
                    handleEnqueue: this.props.handleEnqueue, handleDequeue: this.props.handleDequeue,
                    handleBatchSend: this.props.handleBatchSend }) : _react2.default.createElement(_SingleTX2.default, { actionName: 'Send',
                    sendTX: this.props.handleSend })
            );
        }
    }]);

    return SendTX;
}(_react2.default.Component);

exports.default = SendTX;