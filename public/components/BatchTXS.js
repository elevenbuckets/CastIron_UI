'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SingleTX = require('./SingleTX');

var _SingleTX2 = _interopRequireDefault(_SingleTX);

var _QueuedTXS = require('./QueuedTXS');

var _QueuedTXS2 = _interopRequireDefault(_QueuedTXS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BatchTXS = function (_React$Component) {
    _inherits(BatchTXS, _React$Component);

    function BatchTXS(props) {
        _classCallCheck(this, BatchTXS);

        return _possibleConstructorReturn(this, (BatchTXS.__proto__ || Object.getPrototypeOf(BatchTXS)).call(this, props));
        // this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    // onFormSubmit() {
    //     e.preventDefault();
    //     const addr = e.target.elements.addr.value.trim();
    //     const amount = e.target.elements.amount.value.trim();
    //     const gasNumber = e.target.elements.gasNumber.value.trim();
    //     this.props.sendTX(addr, amount);
    // }

    _createClass(BatchTXS, [{
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'p',
                    null,
                    'This is batch txs!'
                ),
                _react2.default.createElement(_SingleTX2.default, { actionName: 'Enqueue', handleEnqueue: this.props.handleEnqueue, selected_account: this.props.selected_account }),
                _react2.default.createElement(
                    'p',
                    null,
                    'Here are the queued payments currently: '
                ),
                _react2.default.createElement(_QueuedTXS2.default, { queuedTxs: this.props.queuedTxs, selected_account: this.props.selected_account,
                    handleDequeue: this.props.handleDequeue }),
                _react2.default.createElement(
                    'button',
                    { onClick: this.props.handleBatchSend },
                    'Send'
                )
            );
        }
    }]);

    return BatchTXS;
}(_react2.default.Component);

exports.default = BatchTXS;