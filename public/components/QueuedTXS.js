'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SingleTX = require('./SingleTX');

var _SingleTX2 = _interopRequireDefault(_SingleTX);

var _QueuedTX = require('./QueuedTX');

var _QueuedTX2 = _interopRequireDefault(_QueuedTX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueuedTXS = function (_React$Component) {
    _inherits(QueuedTXS, _React$Component);

    function QueuedTXS(props) {
        _classCallCheck(this, QueuedTXS);

        var _this = _possibleConstructorReturn(this, (QueuedTXS.__proto__ || Object.getPrototypeOf(QueuedTXS)).call(this, props));

        _this.onFormSubmit = _this.onFormSubmit.bind(_this);

        _this.state = {};
        return _this;
    }

    _createClass(QueuedTXS, [{
        key: 'onFormSubmit',
        value: function onFormSubmit() {
            e.preventDefault();
            var addr = e.target.elements.addr.value.trim();
            var amount = e.target.elements.amount.value.trim();
            var gasNumber = e.target.elements.gasNumber.value.trim();
            this.props.sendTX(addr, amount);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                this.props.queuedTxs.map(function (tx, index) {
                    return _react2.default.createElement(_QueuedTX2.default, { key: index, tx: tx,
                        handleDequeue: _this2.props.handleDequeue });
                })
            );
        }
    }]);

    return QueuedTXS;
}(_react2.default.Component);

exports.default = QueuedTXS;